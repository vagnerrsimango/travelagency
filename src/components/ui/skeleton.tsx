// Shimmering placeholder blocks shown while a catalog section streams from
// the database (see each page's use of <Suspense> around its data-fetching
// child component). Never a full-page loader — the static hero above these
// sections renders immediately either way.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-skeleton rounded-lg ${className}`} />;
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-darkgray/20 overflow-hidden bg-white">
          <Skeleton className="h-44 rounded-none" />
          <div className="p-5 flex flex-col gap-3">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-8 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-72 shrink-0 w-full max-w-[calc(33.333%-16px)]" />
      ))}
    </div>
  );
}

type SectionSkeletonProps = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  bgClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  cardCount?: number;
  variant?: "grid" | "carousel";
};

// The section header (eyebrow/title/description) is static copy, not
// database-dependent — it renders immediately with real text. Only the
// card area shows the shimmer, since that's what's actually waiting on
// the database query this fallback covers.
export function SectionSkeleton({
  eyebrow,
  title,
  titleAccent,
  description,
  bgClassName = "bg-lightbeige",
  titleClassName = "text-textdark",
  descriptionClassName = "text-parablack",
  cardCount = 4,
  variant = "grid",
}: SectionSkeletonProps) {
  return (
    <div className={`px-7 lg:px-28 py-14 lg:py-28 ${bgClassName}`}>
      <div className="mb-12">
        {eyebrow && <p className="text-orange text-sm uppercase tracking-widest mb-3">{eyebrow}</p>}
        <h2 className={`text-4xl md:text-5xl ${titleClassName}`}>
          {title} {titleAccent && <span className="italic">{titleAccent}</span>}
        </h2>
        {description && <p className={`text-lg mt-4 max-w-md ${descriptionClassName}`}>{description}</p>}
      </div>
      {variant === "grid" ? <CardGridSkeleton count={cardCount} /> : <CarouselSkeleton count={cardCount} />}
    </div>
  );
}
