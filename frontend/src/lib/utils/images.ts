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
    previewImage: `https://images.weserv.nl/?url=${encodedUrl}&w=${width}&output=webp`,
  };
};
