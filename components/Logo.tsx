import Link from "next/link";
import { site } from "@/lib/site";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <AccountsStoreIcon />
      <div className="flex flex-col leading-tight">
        <span className="text-base font-black tracking-tight text-fg sm:text-lg">
          {site.name}
        </span>
        <span className="text-[11px] font-bold text-red-500">
          اشتراكات الترفيه في مصر 🇪🇬
        </span>
      </div>
    </Link>
  );
}

export function AccountsStoreIcon({ size = 42 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
      aria-hidden="true"
    >
      {/* خلفية سوداء داكنة */}
      <rect width="100" height="100" rx="20" fill="#09090b" />
      
      {/* مقابض شنطة التسوق المتصلة */}
      <path
        d="M38 42 V 26 C 38 14, 46 8, 50 8 C 54 8, 62 14, 62 26 V 42"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M44 26 C 44 18, 48 14, 50 14 C 52 14, 56 18, 56 26"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* جسم شنطة التسوق */}
      <rect
        x="20"
        y="36"
        width="60"
        height="56"
        rx="6"
        fill="#09090b"
        stroke="#ffffff"
        strokeWidth="4"
      />

      {/* حرف N الأبيض الناصع (Netflix) */}
      <path
        d="M38 48 V 66 L 54 48 V 66"
        stroke="#ffffff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* كلمة "شاهد" بالأسفل + 3 نقط مضيئة خضراء/تركواز */}
      <text
        x="50"
        y="82"
        fontFamily="Segoe UI, Tahoma, Arial, sans-serif"
        fontSize="14"
        fontWeight="900"
        fill="#ffffff"
        textAnchor="middle"
      >
        شاهـد
      </text>

      {/* 3 نقاط خضراء مضيئة فوق شاهد */}
      <circle cx="43" cy="71" r="1.8" fill="#10B981" className="animate-pulse" />
      <circle cx="48" cy="71" r="1.8" fill="#06B6D4" className="animate-pulse" />
      <circle cx="53" cy="71" r="1.8" fill="#10B981" className="animate-pulse" />
    </svg>
  );
}
