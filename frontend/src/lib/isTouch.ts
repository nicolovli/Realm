// Detects coarse pointers (touch/pen) via matchMedia
export const isCoarsePointer = () => {
  const matches =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches;
  return matches;
};
