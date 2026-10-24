"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageLightbox({ images, title }: { images: { url: string; caption?: string }[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        {images.map((img, idx) => (
          <button key={idx} type="button" className="relative h-48 overflow-hidden rounded-xl" onClick={() => setActive(idx)}>
            <Image src={img.url} alt={img.caption || title} fill className="object-cover" />
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={() => setActive(null)}>
          <div className="relative h-[70vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[active].url} alt={title} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
