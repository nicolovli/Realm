import { FeaturedSection } from "@/components/FeaturedSection";
import { PromoCard } from "@/components/InformationCards";
import { useEffect } from "react";

export const HomePage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <main className="home">
      <section className="w-[min(1600px,92%)] mx-auto" aria-label="Promo">
        <PromoCard />
      </section>

      <section
        className="w-[min(1600px,92%)] mx-auto grid gap-[clamp(20px,3vw,32px)]"
        aria-label="Featured games"
      >
        <FeaturedSection />
      </section>
    </main>
  );
};
