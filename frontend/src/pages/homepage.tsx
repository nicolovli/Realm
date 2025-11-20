import { FeaturedSection } from "@/components/FeaturedSection";
import { PromoCard } from "@/components/InformationCards";
import { useEffect } from "react";

export const HomePage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <main className={`home`}>
      <section
        className={`w-[min(1600px,92%)] mx-auto flex flex-col gap-10 py-10`}
      >
        <section aria-label="Promo">
          <PromoCard />
        </section>

        <section aria-label="Featured games">
          <FeaturedSection />
        </section>
      </section>
    </main>
  );
};
