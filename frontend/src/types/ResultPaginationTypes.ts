export type ResultsPaginationProps = {
  page: number; // currentPage from hook
  totalPages: number; // from hook
  canPrev?: boolean; // default: page > 1
  canNext?: boolean; // default: page < totalPages (or use hasMore)
  onPrev: () => void; // handlePrevPage
  onNext: () => void; // handleNextPage
  onPage?: (page: number) => void; // optional direct jump
  isJumping?: boolean;
};
