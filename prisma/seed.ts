import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Local dev seed data only — no admin users or credentials are created
// here on purpose. Backoffice auth doesn't exist yet (see ROADMAP.md
// Phase 1); seed it once real password hashing lands.

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const maputo = await prisma.destination.upsert({
    where: { slug: "maputo" },
    update: {},
    create: {
      slug: "maputo",
      nameEn: "Maputo",
      namePt: "Maputo",
      country: "Mozambique",
      region: "Southern Mozambique",
      descriptionEn: "Mozambique's capital — Indian Ocean waterfront, art deco streets and a growing food scene.",
      descriptionPt: "A capital de Moçambique — frente marítima do Índico, ruas art deco e uma cena gastronómica em crescimento.",
      status: "PUBLISHED",
      sortOrder: 1,
    },
  });

  const victoriaFalls = await prisma.destination.upsert({
    where: { slug: "victoria-falls" },
    update: {},
    create: {
      slug: "victoria-falls",
      nameEn: "Victoria Falls",
      namePt: "Cataratas Vitória",
      country: "Zimbabwe/Zambia",
      region: "Southern Africa",
      descriptionEn: "One of the Seven Natural Wonders of the World, on the Zambezi River.",
      descriptionPt: "Uma das Sete Maravilhas Naturais do Mundo, no rio Zambeze.",
      status: "PUBLISHED",
      sortOrder: 2,
    },
  });

  await prisma.hotel.upsert({
    where: { slug: "polana-serena-maputo" },
    update: {},
    create: {
      slug: "polana-serena-maputo",
      nameEn: "Polana Serena Hotel",
      namePt: "Hotel Polana Serena",
      destinationId: maputo.id,
      category: "5 stars",
      address: "Avenida Julius Nyerere, Maputo",
      descriptionEn: "A historic landmark hotel overlooking the Indian Ocean.",
      descriptionPt: "Um hotel histórico e emblemático com vista para o Oceano Índico.",
      amenities: ["Pool", "Spa", "Ocean view", "Free WiFi"],
      pricePerNight: 180,
      currency: "USD",
      status: "PUBLISHED",
    },
  });

  await prisma.travelPackage.upsert({
    where: { slug: "victoria-falls-3-day" },
    update: {},
    create: {
      slug: "victoria-falls-3-day",
      nameEn: "Victoria Falls — 3 Day Escape",
      namePt: "Cataratas Vitória — Escapadela de 3 Dias",
      destinationId: victoriaFalls.id,
      itineraryEn: "Day 1: Arrival & falls tour. Day 2: Zambezi sunset cruise. Day 3: Departure.",
      itineraryPt: "Dia 1: Chegada e tour às cataratas. Dia 2: Cruzeiro ao pôr do sol no Zambeze. Dia 3: Partida.",
      inclusions: ["Accommodation", "Breakfast", "Falls entry ticket"],
      exclusions: ["International flights", "Travel insurance"],
      durationDays: 3,
      pricePerPerson: 650,
      currency: "USD",
      capacity: 12,
      status: "PUBLISHED",
    },
  });

  await prisma.vehicle.upsert({
    where: { id: "seed-vehicle-suv" },
    update: {},
    create: {
      id: "seed-vehicle-suv",
      category: "SUV",
      model: "Toyota RAV4 or similar",
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      pricePerDay: 65,
      currency: "USD",
      status: "PUBLISHED",
    },
  });

  await prisma.ancillaryService.upsert({
    where: { key: "travel-insurance" },
    update: {},
    create: {
      key: "travel-insurance",
      nameEn: "Travel Insurance",
      namePt: "Seguro de Viagem",
      descriptionEn: "Coverage adapted to each destination and duration, for peace of mind and entry-requirement compliance.",
      descriptionPt: "Cobertura adequada a cada destino e duração, para viajar com tranquilidade e em conformidade com as exigências de entrada.",
      status: "PUBLISHED",
      sortOrder: 1,
    },
  });

  await prisma.ancillaryService.upsert({
    where: { key: "visa-documentation" },
    update: {},
    create: {
      key: "visa-documentation",
      nameEn: "Visa & Documentation Assistance",
      namePt: "Apoio para Vistos e Documentação",
      descriptionEn: "Guidance and preparation of the documentation process, reducing errors, delays and unnecessary trips.",
      descriptionPt: "Orientação e preparação do processo documental, reduzindo erros, atrasos e deslocações desnecessárias.",
      status: "PUBLISHED",
      sortOrder: 2,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
