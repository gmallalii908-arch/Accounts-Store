"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface CardItem {
  imgUrl?: string;
  alt?: string;
  linkUrl?: string;
  name?: string;
  comment?: string;
  rating?: number;
  badge?: string;
  date?: string;
}

interface SocialCardsProps {
  cards: CardItem[];
}

const MAX_VISIBLE = 5; // 5 visible cards is optimal for clean mobile & desktop displays
const HALF = 2;

const FAN_POSITIONS = [
  { rot: -16, scale: 0.82, x: -24, y: 5.0, zIndex: 2 },
  { rot: -8,  scale: 0.92, x: -12, y: 1.8, zIndex: 4 },
  { rot: 0,   scale: 1.0,  x: 0,   y: 0.0, zIndex: 10 },
  { rot: 8,   scale: 0.92, x: 12,  y: 1.8, zIndex: 4 },
  { rot: 16,  scale: 0.82, x: 24,  y: 5.0, zIndex: 2 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.32;
  if (width < 640) return 0.45;
  if (width < 768) return 0.6;
  if (width < 1024) return 0.8;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = typeof window !== "undefined" ? window.innerHeight * 0.7 : idealPx;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 16,
    scale: 1.0 - 0.18 * absDistance * absDistance,
    x: distance * 24,
    y: absDistance * absDistance * 5.0,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl text-white cursor-pointer shrink-0 z-30 outline-none shadow-xl hover:border-amber-400 hover:text-amber-300 active:scale-95 transition-all duration-300";

export default function SocialCards({ cards }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  // Touch gesture refs
  const touchStartX = useRef<number | null>(null);

  const totalCards = cards.length;
  const needsPagination = totalCards > 1;
  const [centerIndex, setCenterIndex] = useState(0);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    const slotCount = Math.min(totalCards, MAX_VISIBLE);
    const half = slotCount >> 1;
    for (let slot = 0; slot < slotCount; slot++) {
      const cardIdx = ((center + slot - half) % totalCards + totalCards) % totalCards;
      map.set(cardIdx, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  // Touch swipe handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diffX) > 35) {
      if (diffX < 0) {
        cycle("right");
      } else {
        cycle("left");
      }
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = Math.min(totalCards, MAX_VISIBLE);
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${6 * hMult}rem`, rotation: 0, scale: 0.6, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.9, ease: "power2.out", delay: 0.1 + slot * 0.05, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 30 : -30;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 25 : -25, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.45, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -30 : 30;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -25 : 25, duration: 0.35, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg className="relative z-[2] w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className="flex flex-col items-center w-full py-4 px-2 sm:px-6 relative z-20 overflow-hidden">
      <div className="flex items-center justify-center w-full max-w-[90rem]">
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fan-layout flex relative justify-center items-center w-full max-w-[80rem] h-[340px] sm:h-[390px] touch-pan-y"
        >
          {cards.map((card, index) => {
            const isReviewCard = Boolean(card.name || card.comment);

            const cardInner = isReviewCard ? (
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col justify-between rounded-3xl border border-white/15 bg-surface/95 backdrop-blur-2xl shadow-2xl overflow-hidden group">
                <div className="pointer-events-none absolute -top-px right-8 left-8 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
                
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex gap-1 text-amber-400 text-sm font-bold">
                      {Array.from({ length: card.rating || 5 }).map((_, i) => (
                        <span key={i} className="drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]">
                          ★
                        </span>
                      ))}
                    </div>
                    {card.badge && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-black text-amber-300">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-fg font-medium line-clamp-4">
                    "{card.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-white/10 pt-3.5 mt-auto">
                  <div className="relative shrink-0">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-red-600 via-purple-600 to-amber-500 font-black text-white text-xs shadow-lg">
                      {card.name ? card.name.slice(0, 1) : "👤"}
                    </div>
                    <span className="absolute -bottom-1 -left-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-bold text-black ring-2 ring-surface">
                      ✓
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-black text-fg line-clamp-1">{card.name}</p>
                      <span className="text-[9px] text-emerald-400 font-bold">مؤكد</span>
                    </div>
                    {card.date && <p className="text-[9px] text-muted font-medium">{card.date}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/20 bg-surface/90 shadow-2xl group flex items-center justify-center p-1">
                <img
                  src={card.imgUrl}
                  loading="lazy"
                  alt={card.alt || `صورة رأي عميل ${index + 1}`}
                  className="w-full h-full object-cover object-top rounded-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
                <span className="absolute bottom-3 right-3 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-2.5 py-1 text-[10px] font-black text-emerald-300 backdrop-blur-md z-20">
                  🟢 تحويل حقيقي مؤكد
                </span>
              </div>
            );

            return (
              <div
                key={index}
                onClick={() => {
                  if (!isAnimating.current) setCenterIndex(index);
                }}
                className="fan-card absolute w-[250px] h-[330px] sm:w-[300px] sm:h-[380px] cursor-pointer select-none"
              >
                {cardInner}
              </div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6 z-30">
          <button className={`${ARROW_CLASSES} w-11 h-11`} onClick={() => cycle("left")} aria-label="السابق">
            {chevron("left")}
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isAnimating.current) setCenterIndex(i);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === centerIndex ? "bg-amber-400 scale-125 shadow-[0_0_10px_rgba(251,191,36,0.9)]" : "bg-white/20"}`}
                aria-label={`انتقل للرأي ${i + 1}`}
              />
            ))}
          </div>
          <button className={`${ARROW_CLASSES} w-11 h-11`} onClick={() => cycle("right")} aria-label="التالي">
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}
