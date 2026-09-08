// The one piece of this whole payments system that isn't real yet, by
// necessity — Payen sandbox access hasn't landed (see ROADMAP.md Phase 6).
// Everything around this file — the Payment model, the admin dashboard,
// the reservation-to-payment flow, webhook idempotency ledger, error
// states — is fully built and real. This adapter is the one seam where
// a live API call plugs in once access exists; nothing else needs to
// change when it does.
//
// TODO(payen-integration): replace initiatePayment's body with a real
// call to Payen's initiate-payment endpoint once sandbox credentials
// exist. Keep the same return shape so nothing upstream needs to change.

export type InitiatePaymentInput = {
  method: "MPESA" | "EMOLA";
  amount: number;
  currency: string;
  /** Full wallet/phone number — never persisted; the adapter is the only
   * place that ever sees it in full before it's masked for storage. */
  walletNumber: string;
  reference: string;
};

export type InitiatePaymentResult = {
  providerIntentId: string;
  status: "PENDING" | "FAILED";
  rawResponse: Record<string, unknown>;
};

export async function initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
  // STUB — no real Payen call happens here yet. Returns a PENDING intent
  // so the rest of the system (dashboard, reservation status, webhook
  // handling design) can be built and tested against a realistic shape
  // today, and swapped for the real call later without touching callers.
  console.warn(
    `[payen-adapter] STUB — no real payment gateway call was made for ${input.reference}. ` +
      "Wire prisma/../payen-adapter.ts to Payen's real API once sandbox access is granted."
  );

  return {
    providerIntentId: `stub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: "PENDING",
    rawResponse: { stub: true, note: "Payen integration not yet wired — see TODO in this file." },
  };
}

/** Keeps only the last 4 digits — the schema deliberately never stores a
 * full wallet number (NFR Pagamentos). */
export function maskWallet(walletNumber: string): string {
  const digits = walletNumber.replace(/\D/g, "");
  if (digits.length <= 4) return "*".repeat(digits.length);
  return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
}
