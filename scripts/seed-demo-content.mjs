// Injects realistic demo catalog content (destinations, hotels, vehicles,
// packages, services, promo fares) for client-facing showcase purposes.
//
// Deliberately goes through the real admin HTTP API — the same
// create -> review -> approve -> publish workflow an agent would use by
// hand — rather than writing to the database directly. That means every
// row gets real zod validation, lands in the audit log, and (for promo
// fares) goes through the FlightOffer+PromoOffer transaction, exactly
// like production data would.
//
// Usage:
//   node scripts/seed-demo-content.mjs
//
// Requires the dev server running (npm run dev) and BOOTSTRAP_ADMIN_EMAIL
// / BOOTSTRAP_ADMIN_PASSWORD set in .env (see prisma/bootstrap-admin.ts).
// Source content: scripts/demo-content.json.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.SEED_BASE_URL || "http://localhost:3000";
const EMAIL = process.env.BOOTSTRAP_ADMIN_EMAIL;
const PASSWORD = process.env.BOOTSTRAP_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("Missing BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD in .env");
  process.exit(1);
}

const data = JSON.parse(readFileSync(join(__dirname, "demo-content.json"), "utf8"));

// Optional argv filter, e.g. `node scripts/seed-demo-content.mjs --section=hotels`
// — lets a failed section be retried without recreating everything else.
const sectionArg = process.argv.find((a) => a.startsWith("--section="));
const onlySection = sectionArg ? sectionArg.split("=")[1] : null;

// zod's `.optional()` accepts a missing key but rejects an explicit null —
// source JSON (from ChatGPT) uses null for "no value" on some fields, so
// strip those before sending rather than loosen every schema to `.nullable()`.
function stripNulls(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null) out[k] = v;
  }
  return out;
}

// --- tiny manual cookie jar (Node's fetch doesn't persist cookies itself) ---
const cookies = new Map();
function captureCookies(res) {
  const raw = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  for (const line of raw) {
    const [pair] = line.split(";");
    const eq = pair.indexOf("=");
    if (eq > -1) cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}
function cookieHeader() {
  return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...options.headers, Cookie: cookieHeader() },
  });
  captureCookies(res);
  return res;
}

async function login() {
  const csrfRes = await request("/api/auth/csrf");
  const { csrfToken } = await csrfRes.json();
  const loginRes = await request("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: EMAIL, password: PASSWORD, csrfToken, json: "true" }),
  });
  const session = await request("/api/auth/session");
  const sessionData = await session.json();
  if (!sessionData?.user) {
    throw new Error(`Login failed (status ${loginRes.status}) — check BOOTSTRAP_ADMIN_EMAIL/PASSWORD`);
  }
  console.log(`Logged in as ${sessionData.user.email} (${sessionData.user.role})`);
}

async function createAndPublish(basePath, payload, label) {
  const createRes = await request(basePath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stripNulls(payload)),
  });
  const created = await createRes.json();
  if (!createRes.ok) {
    console.error(`  FAILED create ${label}: ${createRes.status} ${JSON.stringify(created)}`);
    return null;
  }

  const statusPath = `${basePath}/${created.id}/status`;
  for (const status of ["IN_REVIEW", "APPROVED", "PUBLISHED"]) {
    const statusRes = await request(statusPath, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!statusRes.ok) {
      console.error(`  FAILED status ${status} for ${label}: ${statusRes.status}`);
      return created;
    }
  }
  console.log(`  OK ${label}`);
  return created;
}

async function findDestinationIdBySlug(slug) {
  const res = await request("/api/admin/destinations");
  const rows = await res.json();
  const row = rows.find((r) => r.slug === slug);
  return row ? row.id : null;
}

async function main() {
  await login();
  const run = (name) => !onlySection || onlySection === name;

  const destinationIdBySlug = new Map();
  if (run("destinations")) {
    console.log(`\nDestinations (${data.destinations.length})`);
    for (const d of data.destinations) {
      const created = await createAndPublish("/api/admin/destinations", d, d.namePt);
      if (created) destinationIdBySlug.set(d.slug, created.id);
    }
  }

  if (run("hotels")) {
    console.log(`\nHotels (${data.hotels.length})`);
    for (const h of data.hotels) {
      let destinationId = destinationIdBySlug.get(h.destinationSlug);
      if (!destinationId) destinationId = await findDestinationIdBySlug(h.destinationSlug);
      if (!destinationId) {
        console.error(`  SKIPPED ${h.namePt} — unknown destinationSlug "${h.destinationSlug}"`);
        continue;
      }
      // extra "destinationSlug" key is harmless — the API's zod schema
      // silently strips unknown fields
      await createAndPublish("/api/admin/hotels", { ...h, destinationId }, h.namePt);
    }
  }

  if (run("vehicles")) {
    console.log(`\nVehicles (${data.vehicles.length})`);
    for (const v of data.vehicles) {
      await createAndPublish("/api/admin/vehicles", v, `${v.category} — ${v.model}`);
    }
  }

  if (run("packages")) {
    console.log(`\nPackages (${data.packages.length})`);
    for (const p of data.packages) {
      let destinationId = p.destinationSlug ? destinationIdBySlug.get(p.destinationSlug) : undefined;
      if (p.destinationSlug && !destinationId) destinationId = await findDestinationIdBySlug(p.destinationSlug);
      if (p.destinationSlug && !destinationId) {
        console.error(`  SKIPPED ${p.namePt} — unknown destinationSlug "${p.destinationSlug}"`);
        continue;
      }
      await createAndPublish("/api/admin/packages", { ...p, destinationId }, p.namePt);
    }
  }

  if (run("services")) {
    console.log(`\nServices (${data.services.length})`);
    const icons = ["/images/paths.svg", "/images/vip.svg", "/images/safe.svg", "/images/price.svg"];
    for (let i = 0; i < data.services.length; i++) {
      const s = data.services[i];
      await createAndPublish("/api/admin/services", { ...s, icon: icons[i % icons.length] }, s.namePt);
    }
  }

  if (run("promoFares")) {
    console.log(`\nPromo fares (${data.promoFares.length})`);
    for (const f of data.promoFares) {
      await createAndPublish("/api/admin/promo-fares", f, `${f.origin} -> ${f.destinationLabel}`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
