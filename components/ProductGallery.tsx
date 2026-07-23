"use client";

import { useState } from "react";

function getPosterByAlt(alt: string): string {
  const str = alt.toLowerCase();
  if (str.includes("shahid") || str.includes("شاهد")) return "/products/shahid.svg";
  if (str.includes("netflix") || str.includes("نتفليكس")) return "/products/netflix.svg";
  if (str.includes("osn")) return "/products/osn.svg";
  if (str.includes("disney") || str.includes("ديزني")) return "/products/disney.svg";
  return "/products/placeholder.svg";
}

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const fallback = getPosterByAlt(alt);
  const list = images.length > 0 ? images : [fallback];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* الصورة الرئيسية */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={list[active] || fallback}
          alt={alt}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallback;
          }}
          className="h-full w-full object-cover"
        />
      </div>

      {/* الصور المصغّرة */}
      {list.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                i === active
                  ? "border-brand-500"
                  : "border-line hover:border-brand-600/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallback;
                }}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
