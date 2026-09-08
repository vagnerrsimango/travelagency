import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReservationService } from "@/lib/data-access/reservations";
import { PaymentService } from "@/lib/data-access/payments";
import {
  canManageCatalog,
  canManagePayments,
  canManageReservations,
  canManageUsers,
} from "@/lib/permissions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: "Recebido",
  IN_REVIEW: "Em análise",
  QUOTE_SENT: "Cotação enviada",
  AWAITING_PAYMENT: "A aguardar pagamento",
  PAYMENT_PENDING: "Pagamento pendente",
  CONFIRMED: "Confirmado",
  REJECTED: "Rejeitado",
  CANCELLED: "Cancelado",
  COMPLETED: "Concluído",
};

const SERVICE_TYPE_LABEL: Record<string, string> = {
  FLIGHT: "Voo",
  HOTEL: "Hotel",
  CAR: "Viatura",
  PACKAGE: "Pacote",
  SERVICE: "Serviço",
  CUSTOM: "Personalizado",
};

async function getCatalogSummary() {
  const [hotels, vehicles, packages, destinations, services] = await Promise.all([
    prisma.hotel.count({ where: { status: "PUBLISHED" } }),
    prisma.vehicle.count({ where: { status: "PUBLISHED" } }),
    prisma.travelPackage.count({ where: { status: "PUBLISHED" } }),
    prisma.destination.count({ where: { status: "PUBLISHED" } }),
    prisma.ancillaryService.count({ where: { status: "PUBLISHED" } }),
  ]);
  return { hotels, vehicles, packages, destinations, services, total: hotels + vehicles + packages + destinations + services };
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

  const [reservationSummary, paymentSummary, catalogSummary, recentReservations, staffCount] = await Promise.all([
    canManageReservations(role) ? ReservationService.summary() : null,
    canManagePayments(role) ? PaymentService.summary() : null,
    canManageCatalog(role) ? getCatalogSummary() : null,
    canManageReservations(role) ? ReservationService.findRecent(8) : null,
    canManageUsers(role) ? prisma.adminUser.count({ where: { isActive: true } }) : null,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Painel</h1>
      <p className="text-slate-500 mt-1 mb-8">
        Bem-vindo(a), {session?.user.name}.
      </p>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {reservationSummary && (
          <Link href="/admin/reservas" className="rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-slate-300 transition-colors">
            <p className="text-xs font-medium text-slate-500 uppercase">Reservas</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{reservationSummary.total}</p>
            <p className="text-xs text-slate-500 mt-1">
              {reservationSummary.needsAttention > 0 ? (
                <span className="text-orange-600 font-medium">{reservationSummary.needsAttention} a precisar de atenção</span>
              ) : (
                "Nenhuma a precisar de atenção"
              )}
            </p>
          </Link>
        )}

        {paymentSummary && (
          <Link href="/admin/pagamentos" className="rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-slate-300 transition-colors">
            <p className="text-xs font-medium text-slate-500 uppercase">Pagamentos pendentes</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{paymentSummary.pending}</p>
            <p className="text-xs text-slate-500 mt-1">
              {paymentSummary.confirmed} confirmado(s), {paymentSummary.failed} falhado(s)
            </p>
          </Link>
        )}

        {paymentSummary && (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase">Total confirmado</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">
              {paymentSummary.totalConfirmedAmount.toLocaleString("pt-PT")}
            </p>
            <p className="text-xs text-slate-500 mt-1">MZN, MPesa + e-Mola combinados</p>
          </div>
        )}

        {catalogSummary && (
          <Link href="/admin/catalogo" className="rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-slate-300 transition-colors">
            <p className="text-xs font-medium text-slate-500 uppercase">Itens publicados</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{catalogSummary.total}</p>
            <p className="text-xs text-slate-500 mt-1">
              {catalogSummary.hotels} hotéis, {catalogSummary.vehicles} viaturas, {catalogSummary.packages} pacotes
            </p>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservations by status */}
        {reservationSummary && (
          <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900 mb-3">Reservas por estado</p>
            <div className="space-y-2">
              {Object.entries(reservationSummary.byStatus)
                .filter(([, count]) => count > 0)
                .map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{STATUS_LABEL[status] ?? status}</span>
                    <span className="font-medium text-slate-900">{count}</span>
                  </div>
                ))}
              {reservationSummary.total === 0 && <p className="text-sm text-slate-400">Sem reservas ainda.</p>}
            </div>
          </div>
        )}

        {/* Recent activity */}
        {recentReservations && (
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-900">Atividade recente</p>
              <Link href="/admin/reservas" className="text-xs font-medium text-orange-600 hover:text-orange-700">
                Ver todas
              </Link>
            </div>
            {recentReservations.length === 0 ? (
              <p className="text-sm text-slate-400">Ainda sem pedidos de reserva.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentReservations.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="text-slate-900 font-medium truncate">{r.customer.fullName}</p>
                      <p className="text-slate-400 text-xs">
                        {r.reference} · {SERVICE_TYPE_LABEL[r.serviceType] ?? r.serviceType}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-slate-600 text-xs">{STATUS_LABEL[r.status] ?? r.status}</p>
                      <p className="text-slate-400 text-xs">{new Date(r.createdAt).toLocaleDateString("pt-PT")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!reservationSummary && !paymentSummary && !catalogSummary && !staffCount && (
        <p className="text-slate-500 text-sm">
          A sua conta ainda não tem acesso a nenhum módulo com dados para mostrar aqui.
        </p>
      )}
    </div>
  );
}
