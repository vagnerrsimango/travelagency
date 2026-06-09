"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLocaleFromPathname, getStatusCopy } from "@/i18n/status";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const copy = getStatusCopy(locale).error;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        {copy.title}
      </h1>
      <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        {copy.description}
      </p>
      <Button onClick={reset}>{copy.tryAgain}</Button>
    </div>
  );
}
