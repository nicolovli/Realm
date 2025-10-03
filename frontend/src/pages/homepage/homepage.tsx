import FeaturedSectionContainer from "../../components/featured-section/FeaturedSectionContainer";
import previewDB from "../../../../backend/db/previewDB.json";
import { PromoSection } from "../../components/PromoSection";

export const HomePage = () => {
  return (
    <main className="home">
      <section className="w-[min(1600px,92%)] mx-auto" aria-label="Promo">
        <PromoSection />
      </section>

      <section
        className="w-[min(1600px,92%)] mx-auto grid gap-[clamp(20px,3vw,32px)]"
        aria-label="Featured games"
      >
        <FeaturedSectionContainer items={previewDB} />
      </section>
    </main>
  );
};
