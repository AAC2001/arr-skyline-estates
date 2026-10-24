import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-navy-950 px-4 text-center text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-gold-400">404</p>
      <h1 className="mt-3 font-display text-4xl">Page Not Found</h1>
      <p className="mt-3 max-w-md text-navy-200">The page you are looking for may have moved or no longer exists.</p>
      <Button href="/" variant="gold" className="mt-8">
        Back to Home
      </Button>
    </div>
  );
}
