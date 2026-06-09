"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath } from "@/i18n/config";
import { getLocaleFromPathname, getStatusCopy } from "@/i18n/status";

export default function NotFound() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const copy = getStatusCopy(locale).notFound;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">{copy.code}</p>
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        {copy.title}
      </h1>
      <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        {copy.description}
      </p>
      <Link href={localizedPath(locale, "/")} className="text-sm font-medium underline underline-offset-4">
        {copy.returnHome}
      </Link>
    </div>
  );
}
