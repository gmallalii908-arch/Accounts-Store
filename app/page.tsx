import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import { getActiveProducts } from "@/lib/products";
import { getActiveReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, reviews] = await Promise.all([
    getActiveProducts(),
    getActiveReviews(),
  ]);

  return (
    <>
      <Hero />

      {/* قسم شبكة الباقات والاشتراكات */}
      <section id="products" className="scroll-mt-20 bg-bg py-16">
        <div className="mx-auto max-w-6xl px-4">
          <ProductGrid products={products} />
        </div>
      </section>

      {/* قسم آراء وتقييمات المشتركين */}
      <ReviewsSection reviews={reviews} />

      {/* قسم الأسئلة الشائعة FAQ */}
      <FaqSection />
    </>
  );
}
