import { escapeHtml } from "@/lib/email";
import type { Currency } from "@/generated/prisma/client";
import type { Locale } from "@/i18n/config";

type ReservationConfirmationInput = {
  locale: Locale;
  customerName: string;
  reference: string;
  itemName: string;
  /** Null for an open flight quote request with no matching published
   * fare — there's nothing to show a price for yet, an agent quotes it. */
  total: number | null;
  currency: Currency | null;
};

const COPY = {
  pt: {
    subject: (ref: string) => `ZambiTour | Recebemos o seu pedido (${ref})`,
    slogan: "Viaje. Descubra. Viva.",
    greeting: (name: string) => `Olá ${name},`,
    body1: "Recebemos o seu pedido de reserva e a nossa equipa vai analisá-lo em breve.",
    reference: "Referência",
    item: "Pedido",
    estimate: "Valor estimado",
    quotePending: "A aguardar cotação",
    body2: "Um dos nossos agentes vai contactá-lo para confirmar os detalhes e enviar a cotação final, este valor pode ainda ser ajustado antes da confirmação.",
    closing: "Obrigado por escolher a ZambiTour.",
    signature: "Equipa ZambiTour",
  },
  en: {
    subject: (ref: string) => `ZambiTour | We received your request (${ref})`,
    slogan: "Travel. Discover. Live.",
    greeting: (name: string) => `Hi ${name},`,
    body1: "We've received your reservation request and our team will review it shortly.",
    reference: "Reference",
    item: "Request",
    estimate: "Estimated total",
    quotePending: "Awaiting quote",
    body2: "One of our agents will reach out to confirm the details and send the final quote, this amount may still be adjusted before confirmation.",
    closing: "Thank you for choosing ZambiTour.",
    signature: "The ZambiTour Team",
  },
};

export function reservationConfirmationEmail(input: ReservationConfirmationInput): { subject: string; html: string } {
  const t = COPY[input.locale];
  const safeName = escapeHtml(input.customerName);
  const safeItem = escapeHtml(input.itemName);
  const formattedTotal =
    input.total != null && input.currency != null
      ? `${input.currency} ${input.total.toLocaleString(input.locale === "pt" ? "pt-PT" : "en-US")}`
      : t.quotePending;

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #2b2b28;">
      <div style="background: #16321f; padding: 24px; text-align: center;">
        <span style="color: #fff; font-size: 20px; font-weight: 600; letter-spacing: 0.02em;">ZambiTour</span>
        <p style="color: #d97b29; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin: 6px 0 0; font-weight: 600;">${t.slogan}</p>
      </div>
      <div style="padding: 32px 24px; background: #ffffff;">
        <p style="font-size: 16px; margin: 0 0 16px;">${t.greeting(safeName)}</p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px;">${t.body1}</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #6b6b64; font-size: 13px;">${t.reference}</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 13px;">${escapeHtml(input.reference)}</td>
          </tr>
          <tr style="border-top: 1px solid #e7e1d5;">
            <td style="padding: 8px 0; color: #6b6b64; font-size: 13px;">${t.item}</td>
            <td style="padding: 8px 0; text-align: right; font-size: 13px;">${safeItem}</td>
          </tr>
          <tr style="border-top: 1px solid #e7e1d5;">
            <td style="padding: 8px 0; color: #6b6b64; font-size: 13px;">${t.estimate}</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #d97b29; font-size: 15px;">${formattedTotal}</td>
          </tr>
        </table>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #6b6b64;">${t.body2}</p>
        <p style="font-size: 14px; margin: 0;">${t.closing}<br/><strong>${t.signature}</strong></p>
      </div>
    </div>
  `.trim();

  return { subject: t.subject(input.reference), html };
}
