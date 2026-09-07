"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="mt-2 text-xs text-slate-500 hover:text-slate-900 transition-colors"
    >
      Terminar sessão
    </button>
  );
}
