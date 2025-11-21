// Generates a proxied image state so game pages can show cached previews.
import type { PreviewState } from "@/types/UtilityTypes";

export const buildPreviewState = (
  image?: string,
  width = 640,
): PreviewState | undefined => {
  if (!image) {
    return undefined;
  }

  const encodedUrl = encodeURIComponent(image);

  return {
    previewImage: `https://images.weserv.nl/?url=${encodedUrl}&w=${width}&output=webp&q=70`,
  };
};

export const proxiedImageUrl = (image: string, width: number) => {
  const encoded = encodeURIComponent(image);
  return `https://images.weserv.nl/?url=${encoded}&w=${width}&output=webp&q=70`;
};

export const buildSrcSet = (
  image: string,
  widths: number[] = [320, 480, 640, 800, 1200],
): { src: string; srcSet: string; sizes: string } => {
  const pairs = widths.map((w) => `${proxiedImageUrl(image, w)} ${w}w`);
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  return {
    src: proxiedImageUrl(image, widths[Math.floor(widths.length / 2)]),
    srcSet: pairs.join(", "),
    sizes,
  };
};
