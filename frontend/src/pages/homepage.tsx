import { FeaturedSectionContainer } from "../components/FeaturedSection";
import { PromoCard } from "../components/InformationCards";

export const HomePage = () => {
  return (
    <main className="home">
      <section className="w-[min(1600px,92%)] mx-auto" aria-label="Promo">
        <PromoCard />
      </section>

      <section
        className="w-[min(1600px,92%)] mx-auto grid gap-[clamp(20px,3vw,32px)]"
        aria-label="Featured games"
      >
        <FeaturedSectionContainer />
      </section>
    </main>
  );
};
