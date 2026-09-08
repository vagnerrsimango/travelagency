// Shared by the Hero search widget and the real booking form — one place
// for the "which cities can I fly between" list, grouped by country so a
// customer can find where they're going instead of scanning one flat list
// of 20 unrelated names.
export const FLIGHT_CITY_GROUPS: { country: string; cities: string[] }[] = [
  { country: "Moçambique", cities: ["Maputo", "Beira", "Nampula", "Pemba", "Quelimane"] },
  { country: "África do Sul", cities: ["Johannesburg", "Cape Town", "Durban"] },
  { country: "Zimbabwe", cities: ["Harare", "Victoria Falls"] },
  { country: "Zâmbia", cities: ["Lusaka", "Livingstone"] },
  { country: "Tanzânia", cities: ["Dar es Salaam", "Zanzibar"] },
  { country: "Quénia", cities: ["Nairobi"] },
  { country: "Botswana", cities: ["Gaborone"] },
  { country: "Namíbia", cities: ["Windhoek"] },
  { country: "Outros destinos", cities: ["Lisbon", "Dubai", "London"] },
];
