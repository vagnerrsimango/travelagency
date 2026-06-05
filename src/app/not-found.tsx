import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">404</p>
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        The trip you are looking for is not available here.
      </p>
      <Link href="/" className="text-sm font-medium underline underline-offset-4">
        Return home
      </Link>
    </div>
  );
}
