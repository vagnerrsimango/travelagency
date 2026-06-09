"use client";

import { usePathname } from "next/navigation";
import { getLocaleFromPathname, getStatusCopy } from "@/i18n/status";

export default function Loading() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-sm text-zinc-500">
      {getStatusCopy(locale).loading}
    </div>
  );
}
