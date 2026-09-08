import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateQuote, PricingError } from "@/lib/pricing";
import { quoteRequestSchema } from "@/lib/validation/reservation";
import { isAllowed, quoteRateLimit } from "@/lib/rate-limit";

// Public, unauthenticated — this is the live "here's roughly what this
// will cost" estimate the booking form shows as the customer fills it
// in, before they've submitted anything. Rate-limited generously since
// it fires on every form change, not just on submit.
export async function POST(request: NextRequest) {
  if (!isAllowed(request, quoteRateLimit)) {
    return NextResponse.json({ error: "Demasiados pedidos, tente novamente em breve" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const input = quoteRequestSchema.parse(body);
    const quote = await calculateQuote(input);
    return NextResponse.json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    if (error instanceof PricingError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error calculating quote:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
