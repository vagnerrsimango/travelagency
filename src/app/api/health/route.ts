export function GET() {
  return Response.json({
    ok: true,
    service: "travelagency",
    timestamp: new Date().toISOString(),
  });
}
