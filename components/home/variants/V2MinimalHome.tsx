"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  SlidersHorizontal,
  Star,
  MapPin,
  Apple,
  Carrot,
  Milk,
  Candy,
  GlassWater,
  Baby,
} from "lucide-react";

import productData from "@/data/product.json";
import { useCart } from "@/store/cart-context";
import { useWishlist } from "@/store/wishlist-context";

type Locale = "en" | "ps" | "fa-AF";

type ProductRow = {
  id: string;
  price: number;
  priceDisplay: string;
  vendor: string;
  image: string;
  name: { en: string; ps: string; "fa-AF": string };
  badge: { en: string; ps: string; "fa-AF": string };
  category: string;
  rating: number;
  reviews: number;
  delivery: string;
  inStock: boolean;
};

type SortKey = "default" | "price-low" | "price-high" | "rating";

const CATEGORY_META = [
  { id: "groceries", icon: Apple },
  { id: "flowers", icon: Carrot },
  { id: "baby", icon: Baby },
  { id: "gifts", icon: Candy },
  { id: "dairy", icon: Milk },
  { id: "beverages", icon: GlassWater },
] as const;

const BRAND_FILTERS = ["Mandawee Market", "Noor Premium Gifts", "Bloom Avenue", "Fresh Farm Co"] as const;

const HERO = {
  en: [
    {
      title: "Fresh groceries from trusted vendors",
      sub: "Discover daily essentials, seasonal produce, and top marketplace deals in one cart.",
      cta: "Shop now",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Same-day picks for busy families",
      sub: "From fruits to baby care, get fast delivery from verified multi-vendor stores.",
      cta: "Explore offers",
      image:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Top deals across grocery and gifts",
      sub: "Limited-time discounts with real ratings, trusted vendors, and easy add-to-cart.",
      cta: "View deals",
      image:
        "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1600&q=80",
    },
  ],
  ps: [
    {
      title: "له باوري پلورونکو تازه خوراکي توکي",
      sub: "ورځني اړتیاوې، فصلي توکي، او د بازار غوره وړاندیزونه په یوه کارټ کې.",
      cta: "اوس واخلئ",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "د بوختو کورنیو لپاره همدا ورځ توکي",
      sub: "له میوو تر ماشوم پاملرنې، له تایید شوو پلورونکو څخه چټک تحویل.",
      cta: "وړاندیزونه وګورئ",
      image:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "په خوراکي او ډالیو کې غوره تخفیفونه",
      sub: "محدود وخت وړاندیزونه، ریښتینې درجې، باوري پلورونکي، او اسانه کارټ ته اضافه کول.",
      cta: "تخفیفونه وګورئ",
      image:
        "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1600&q=80",
    },
  ],
  "fa-AF": [
    {
      title: "مواد خوراکی تازه از فروشندگان معتبر",
      sub: "نیازهای روزانه، محصولات فصلی و بهترین دیل‌ها را در یک سبد پیدا کنید.",
      cta: "همین حالا خرید کنید",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "انتخاب‌های همان‌روز برای خانواده‌ها",
      sub: "از میوه تا مراقبت نوزاد، تحویل سریع از فروشندگان تاییدشده چندفروشنده.",
      cta: "کاوش پیشنهادها",
      image:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "بهترین تخفیف‌ها در خواربار و هدیه",
      sub: "پیشنهادهای محدودزمان با امتیاز واقعی، فروشنده معتبر و افزودن سریع به سبد.",
      cta: "دیدن دیل‌ها",
      image:
        "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1600&q=80",
    },
  ],
} as const;

const UI = {
  en: {
    location: "Deliver to Kabul",
    allProducts: "All products",
    filters: "Filters",
    sortBy: "Sort by",
    results: "results",
    inStock: "In stock",
    onSale: "On sale",
    add: "Add",
    topDeals: "Top Deals",
    bestSelling: "Best Selling",
    freshPicks: "Fresh Picks",
    switchHome: "Home Variants",
  },
  ps: {
    location: "کابل ته تحویل",
    allProducts: "ټول توکي",
    filters: "فلټرونه",
    sortBy: "ترتیبول",
    results: "پایلې",
    inStock: "په سټاک کې",
    onSale: "تخفیف",
    add: "اضافه",
    topDeals: "غوره تخفیفونه",
    bestSelling: "غوره پلور",
    freshPicks: "تازه انتخابونه",
    switchHome: "د کور نسخې",
  },
  "fa-AF": {
    location: "تحویل به کابل",
    allProducts: "همه محصولات",
    filters: "فیلترها",
    sortBy: "مرتب‌سازی",
    results: "نتیجه",
    inStock: "موجود",
    onSale: "تخفیف‌دار",
    add: "افزودن",
    topDeals: "دیل‌های برتر",
    bestSelling: "پرفروش‌ترین",
    freshPicks: "انتخاب تازه",
    switchHome: "نسخه‌های خانه",
  },
} as const;

export function V2MinimalHome() {
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "ps" || rawLocale === "fa-AF" ? rawLocale : "en";
  const copy = UI[locale];
  const isRtl = locale !== "en";
  const products = productData.featuredProducts as ProductRow[];
  const categories = productData.categories;
  const heroSlides = HERO[locale];

  const [heroIndex, setHeroIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [minPrice, setMinPrice] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [mobileFilters, setMobileFilters] = useState(false);

  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const filteredProducts = useMemo(() => {
    const withFilters = products.filter((item) => {
      const categoryPass = activeCategory === "all" || item.category === activeCategory;
      const pricePass = item.price >= minPrice;
      const stockPass = onlyInStock ? item.inStock : true;
      const salePass = onlySale ? item.price >= 40 : true;
      const brandPass = brands.length === 0 ? true : brands.includes(item.vendor);
      return categoryPass && pricePass && stockPass && salePass && brandPass;
    });

    if (sortBy === "price-low") {
      return [...withFilters].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      return [...withFilters].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rating") {
      return [...withFilters].sort((a, b) => b.rating - a.rating);
    }
    return withFilters;
  }, [activeCategory, brands, minPrice, onlyInStock, onlySale, products, sortBy]);

  const topDeals = [...products].sort((a, b) => a.price - b.price).slice(0, 6);
  const bestSelling = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 6);
  const freshPicks = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

  const prevSlide = () => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setHeroIndex((prev) => (prev + 1) % heroSlides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--footerBg)] pb-12">
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="h-4 w-4 text-[var(--primary)]" />
            {copy.location}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl">
          <Image src={heroSlides[heroIndex].image} alt={heroSlides[heroIndex].title} width={1600} height={640} className="h-[280px] w-full object-cover sm:h-[360px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          <div className="absolute inset-0 flex items-center px-5 sm:px-10">
            <div className="max-w-xl text-white">
              <h1 className="text-2xl font-black sm:text-4xl">{heroSlides[heroIndex].title}</h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">{heroSlides[heroIndex].sub}</p>
              <Link href="/products" className="mt-5 inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white hover:brightness-110">
                {heroSlides[heroIndex].cta}
              </Link>
            </div>
          </div>
          <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.title}
                onClick={() => setHeroIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === heroIndex ? "w-8 bg-white" : "w-2 bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {categories.map((category, index) => {
            const match = CATEGORY_META.find((c) => c.id === category.id);
            const Icon = match?.icon ?? CATEGORY_META[index % CATEGORY_META.length].icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label[locale]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <button
            onClick={() => setMobileFilters((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {copy.filters}
          </button>
          <p className="text-sm font-semibold text-slate-700">
            {filteredProducts.length} {copy.results}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-500">{copy.sortBy}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className={`rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24 lg:h-fit ${mobileFilters ? "block" : "hidden lg:block"}`}>
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">{copy.filters}</h3>

            <div className="mb-4 border-b border-slate-100 pb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Categories</p>
              <div className="space-y-2">
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="category"
                      checked={activeCategory === c.id}
                      onChange={() => setActiveCategory(c.id)}
                    />
                    {c.label[locale]}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4 border-b border-slate-100 pb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Price range</p>
              <input type="range" min={0} max={100} step={5} value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full" />
              <p className="mt-1 text-xs font-semibold text-slate-600">Min ${minPrice}</p>
            </div>

            <div className="mb-4 border-b border-slate-100 pb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Brands</p>
              <div className="space-y-2">
                {BRAND_FILTERS.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={brands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) setBrands((prev) => [...prev, brand]);
                        else setBrands((prev) => prev.filter((item) => item !== brand));
                      }}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} />
                {copy.inStock}
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} />
                {copy.onSale}
              </label>
            </div>
          </aside>

          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const liked = isInWishlist(product.id);
                return (
                  <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative h-40 bg-slate-50 sm:h-44">
                      <Image src={product.image} alt={product.name[locale]} fill className="object-cover" />
                      <button
                        onClick={() =>
                          liked
                            ? removeFromWishlist(product.id)
                            : addToWishlist({
                                id: product.id,
                                name: product.name.en,
                                price: product.price,
                                priceDisplay: product.priceDisplay,
                                vendor: product.vendor,
                                image: product.image,
                              })
                        }
                        className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-slate-600 shadow"
                      >
                        <Heart className={`h-4 w-4 ${liked ? "fill-[var(--primary)] text-[var(--primary)]" : ""}`} />
                      </button>
                      <span className="absolute left-2 top-2 rounded-md bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-white">
                        {product.badge[locale]}
                      </span>
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name[locale]}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Star className="h-3.5 w-3.5 fill-[var(--yellow)] text-[var(--yellow)]" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span>({product.reviews})</span>
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <p className="text-base font-black text-[var(--primary)]">{product.priceDisplay}</p>
                          <p className="text-[11px] text-slate-400">{product.delivery}</p>
                        </div>
                        <button
                          onClick={() => void addItem(product.id, 1)}
                          className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-bold text-white hover:brightness-110"
                        >
                          {copy.add}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[var(--secondary)] px-5 py-4 text-white">
          <p className="text-sm font-bold uppercase tracking-wide">Mega Offer</p>
          <p className="text-lg font-semibold">Up to 35% off selected groceries and household essentials.</p>
        </div>
      </section>

      <ProductRail locale={locale} title={copy.topDeals} products={topDeals} />
      <ProductRail locale={locale} title={copy.bestSelling} products={bestSelling} />

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[var(--primary)] px-5 py-4 text-white">
          <p className="text-sm font-bold uppercase tracking-wide">Vendor Spotlight</p>
          <p className="text-lg font-semibold">Trusted local sellers, faster delivery windows, better daily value.</p>
        </div>
      </section>

      <ProductRail locale={locale} title={copy.freshPicks} products={freshPicks} />
    </div>
  );
}

function ProductRail({ title, products, locale }: { title: string; products: ProductRow[]; locale: Locale }) {
  const { addItem } = useCart();

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        <Link href="/products" className="text-sm font-semibold text-[var(--secondary)]">
          View all
        </Link>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {products.map((product) => (
          <article key={`${title}-${product.id}`} className="w-[210px] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="relative h-32">
              <Image src={product.image} alt={product.name[locale]} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name[locale]}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-black text-[var(--primary)]">{product.priceDisplay}</span>
                <button
                  onClick={() => void addItem(product.id, 1)}
                  className="rounded-md bg-[var(--secondary)] px-2 py-1 text-[11px] font-bold text-white"
                >
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
