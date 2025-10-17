import { useEffect, useRef, type RefObject } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { SearchBar } from "./SearchBar";

interface SearchMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export const MobileSearchMenu = ({
  isOpen,
  onClose,
  triggerRef,
}: SearchMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(isOpen, onClose, menuRef, triggerRef);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <section
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile search menu"
      data-testid="mobile-search-menu"
      className="bg-lightpurple dark:bg-darkpurple rounded-2xl flex flex-col justify-center items-center p-4 md:hidden"
    >
      <SearchBar className="w-full max-w-sm" onSearchSubmit={onClose} />
    </section>
  );
};
