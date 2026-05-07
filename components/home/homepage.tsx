"use client";

import { useLocale } from "next-intl";
import { HomeHeroCarousel } from "./HomeHeroCarousel";
import { HomeCategoryCarousel } from "./HomeCategoryCarousel";
import { HomeMidPromoCarousel } from "./HomeMidPromoCarousel";
import { HomeStackedSections } from "./HomeStackedSections";

export function HomePage() {
  const locale = useLocale();
  const isRtl = locale === "ps" || locale === "fa-AF";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-0 bg-white">
      <HomeHeroCarousel />
      <div className="w-full px-2 pt-4 sm:px-3 sm:pt-6 lg:px-4">
        <HomeMidPromoCarousel />
        <HomeCategoryCarousel />
      </div>
      <HomeStackedSections />
    </div>
  );
}
