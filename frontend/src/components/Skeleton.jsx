/**
 * Fix #9: Reusable skeleton loader component to replace spinners.
 * Animated gray placeholders match the layout of real content,
 * giving the perception of a faster page load.
 */

/* ── Card skeleton (for therapy / product listings) ── */
export function SkeletonCard({ className = "" }) {
  return (
    <div className={`animate-pulse bg-white border border-slate-100 rounded-3xl p-6 space-y-4 ${className}`}>
      <div className="w-full h-40 bg-slate-100 rounded-2xl" />
      <div className="h-4 bg-slate-100 rounded-full w-3/4" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2" />
      <div className="h-3 bg-slate-100 rounded-full w-5/6" />
      <div className="h-10 bg-slate-100 rounded-full w-full mt-2" />
    </div>
  );
}

/* ── Session card skeleton (for practitioner sessions) ── */
export function SkeletonSession({ className = "" }) {
  return (
    <div className={`animate-pulse bg-white border border-slate-100 rounded-3xl p-6 space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-100 rounded-full w-1/2" />
          <div className="h-2.5 bg-slate-100 rounded-full w-1/3" />
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
      </div>
      <div className="h-3 bg-slate-100 rounded-full w-full" />
      <div className="h-3 bg-slate-100 rounded-full w-4/5" />
    </div>
  );
}

/* ── Community question skeleton ── */
export function SkeletonQuestion({ className = "" }) {
  return (
    <div className={`animate-pulse bg-white border border-slate-100 rounded-[2rem] p-8 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-100 rounded-full w-1/3" />
          <div className="h-2.5 bg-slate-100 rounded-full w-1/5" />
        </div>
      </div>
      <div className="h-4 bg-slate-100 rounded-full w-full" />
      <div className="h-4 bg-slate-100 rounded-full w-4/5" />
      <div className="h-3 bg-slate-100 rounded-full w-1/4 mt-2" />
    </div>
  );
}

/* ── Profile stat skeleton ── */
export function SkeletonStat({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-50 rounded-2xl p-5 space-y-2 ${className}`}>
      <div className="h-6 bg-slate-100 rounded-full w-1/2 mx-auto" />
      <div className="h-3 bg-slate-100 rounded-full w-2/3 mx-auto" />
    </div>
  );
}

/* ── Grid of skeleton cards ── */
export function SkeletonGrid({ count = 6, CardComponent = SkeletonCard, cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className={`grid ${cols} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  );
}
