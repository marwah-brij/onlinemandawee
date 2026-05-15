"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { usePathname, useRouter } from "@/i18n/navigation";

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: { opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.15 } },
};

type LanguageSelectorProps = {
  locale: string;
  languages: Array<{ code: string; label: string; flag: string }>;
  label: string;
  isRtl: boolean;
  variant?: "default" | "dark";
};

export function LanguageSelector({
  locale,
  languages,
  label,
  isRtl,
  variant = "default",
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    function click(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", click);
    return () => window.removeEventListener("mousedown", click);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        className={`group h-9 min-h-9 rounded-full border flex items-center gap-2 px-2.5 sm:pr-3 sm:pl-2.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
          variant === "dark"
            ? open
              ? "bg-white border-white text-primary shadow-md ring-2 ring-white/70"
              : "bg-white border-white text-gray-900 hover:bg-gray-50 hover:border-gray-100"
            : open
              ? "bg-white shadow-lg border-primary/30 text-primary"
              : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
        }`}
      >
        <span
          className={`text-lg leading-none w-8 h-8 shrink-0 flex items-center justify-center rounded-full border ${
            variant === "dark"
              ? "bg-gray-50 border-gray-200"
              : "bg-gray-50 border-gray-100"
          }`}
          aria-hidden
        >
          {current.flag}
        </span>
        <span className="hidden min-w-0 truncate text-left text-[12px] font-extrabold tracking-tight text-gray-900 sm:block">
          {current.label}
        </span>
        <span className="sm:hidden text-[11px] font-extrabold uppercase tracking-wide text-gray-900">
          {locale.split("-")[0]}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2.25}
          className={`shrink-0 text-gray-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute mt-3 w-56 bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 z-[1001] overflow-hidden p-2 ${isRtl ? "left-0" : "right-0"}`}
          >
            <p className="px-5 py-3 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">
              {label}
            </p>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setOpen(false);
                  router.replace(pathname, { locale: l.code });
                }}
                className={`w-full px-5 py-3.5 rounded-xl text-sm font-bold flex items-center gap-4 transition-all cursor-pointer ${isRtl ? "text-right" : "text-left"} ${locale === l.code ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <span className="text-xl">{l.flag}</span> {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
