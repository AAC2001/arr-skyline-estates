import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "gold";

const styles: Record<Variant, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800 shadow-soft",
  secondary: "border border-navy-200 bg-white text-navy-900 hover:border-gold-400 hover:text-navy-950",
  ghost: "text-navy-800 hover:bg-navy-50",
  gold: "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-soft",
};

export function Button({
  children,
  className,
  variant = "primary",
  href,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 disabled:opacity-60",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
