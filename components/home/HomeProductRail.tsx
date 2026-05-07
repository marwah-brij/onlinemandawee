"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import productCatalog from "@/data/product.json";
import { useCart } from "@/store/cart-context";
import { toast } from "@/lib/utils/toast";
import { useHorizontalScroll } from "./useHorizontalScroll";

type LocaleKey = "en" | "ps" | "fa-AF";

type Row = {
  id: string;
  price: number;
  priceDisplay: string;
  image: string;
  name: Record<LocaleKey, string>;
};

function ProductCard({ p, locale }: { p: Row; locale: LocaleKey }) {
  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);
  const t = useTranslations("Homepage.store");

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      await addItem(p.id, 1);
      toast.success(t("addedToCart"));
    } catch {
      toast.error(t("addError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="group flex w-[252px] shrink-0 flex-col rounded-sm bg-white ring-2 ring-transparent ring-offset-0 transition-[color,transform,box-shadow,ring-offset-width] duration-200 ease-out hover:-translate-y-0.5 hover:ring-neutral-200 hover:ring-offset-8 hover:ring-offset-white hover:shadow-[0_10px_28px_-14px_rgba(15,23,42,0.1)] sm:w-[260px] md:w-[268px] lg:w-[274px] xl:w-[280px]">
      <Link href={`/products/${p.id}`} className="flex flex-1 flex-col overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-white">
          <Image
            src={p.image}
            alt={p.name[locale]}
            fill
            className="object-cover object-center transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 252px, (max-width: 768px) 260px, (max-width: 1024px) 268px, (max-width: 1280px) 274px, 280px"
          />
        </div>
        <div className="flex flex-1 flex-col pt-4">
          <h3 className="mb-2 min-h-12 line-clamp-2 text-start text-[0.9375rem] font-normal leading-snug tracking-tight text-neutral-700 sm:min-h-14 sm:text-base">
            {p.name[locale]}
          </h3>
          <p className="mb-4 text-start text-base font-semibold text-black">{p.priceDisplay}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={onAdd}
        disabled={busy}
        className="w-full rounded-md border border-black bg-white py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-black transition hover:bg-neutral-50 disabled:opacity-50"
      >
        {busy ? "…" : t("addToCart")}
      </button>
    </div>
  );
}

type Props = {
  productIds?: string[];
  showTitle?: boolean;
};

export function HomeProductRail({ productIds, showTitle = true }: Props) {
  const locale = useLocale() as LocaleKey;
  const t = useTranslations("Homepage.store");
  const all = productCatalog.featuredProducts as Row[];
  const rows = productIds?.length
    ? (productIds
        .map((id) => all.find((p) => p.id === id))
        .filter((p): p is Row => Boolean(p)) as Row[])
    : all;
  const { ref, scroll } = useHorizontalScroll();

  return (
    <section className="mb-0">
      {showTitle ? (
        <h2 className="mb-8 text-center text-lg font-bold uppercase tracking-wide text-slate-900 sm:text-xl">
          {t("featuredTitle")}
        </h2>
      ) : null}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-md transition hover:bg-neutral-50 sm:inline-flex"
          aria-label="prev"
        >
          <ChevronLeft className="h-4 w-4 stroke-[1.75]" />
        </button>
        <div
          ref={ref}
          className="flex min-w-0 flex-1 gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-7 lg:gap-8 [&::-webkit-scrollbar]:hidden"
        >
          {rows.map((p) => (
            <ProductCard key={p.id} p={p} locale={locale} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-md transition hover:bg-neutral-50 sm:inline-flex"
          aria-label="next"
        >
          <ChevronRight className="h-4 w-4 stroke-[1.75]" />
        </button>
      </div>
    </section>
  );
}
