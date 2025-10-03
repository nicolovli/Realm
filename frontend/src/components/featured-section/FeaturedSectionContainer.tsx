import React from "react";
import FeaturedCarousel from "./FeaturedCarousel";
import type { PreviewGame } from "../../types/PreviewGame";
// You can import your JSON directly with Vite:

export default function FeaturedSection({ items }: { items: PreviewGame[] }) {
  const top10 = React.useMemo(() => items.slice(0, 10), [items]);

  console.log(top10);
  return (
    <div className="overflow-x-hidden">
      <FeaturedCarousel
        items={top10}
        onExploreAll={() => console.log("Explore all clicked")}
      />
    </div>
  );
}
