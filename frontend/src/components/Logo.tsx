import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 shadow-lg ring-1 ring-gold-400/40">
        <svg viewBox="0 0 48 48" className="h-7 w-7 text-gold-300" aria-hidden>
          <path
            fill="currentColor"
            d="M8 34V18l6-4 6 3 8-6 12 8v15H8zm4-2h24V22l-10-7-6 4-5-2.5L12 24v8z"
          />
          <path fill="currentColor" d="M14 14h3v8h-3zm8 6h3v6h-3zm8-4h3v10h-3z" opacity="0.85" />
        </svg>
      </div>
      {!compact && (
        <div>
          <p className="font-display text-lg font-semibold tracking-wide text-navy-900">ARR</p>
          <p className="-mt-1 text-xs font-medium uppercase tracking-[0.2em] text-gold-600">Skyline Estates</p>
        </div>
      )}
    </Link>
  );
}
