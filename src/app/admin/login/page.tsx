import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <Image
          src="/icons/logooficial.png"
          alt="ZambiTour"
          width={280}
          height={228}
          className="h-14 w-auto object-contain invert mb-4"
        />
        <h1 className="text-xl font-semibold text-slate-900">ZambiTour Backoffice</h1>
        <p className="text-sm text-orange-700/80 uppercase tracking-wide text-xs font-semibold mt-1">Viaje. Descubra. Viva.</p>
        <p className="text-sm text-slate-500 mt-2 mb-6">Acesso restrito à equipa.</p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
