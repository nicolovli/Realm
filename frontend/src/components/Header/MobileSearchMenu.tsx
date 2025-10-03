import { useEffect, useRef, type RefObject } from "react";
import { useClickOutside } from "./useClickOutside";

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
      className=" bg-lightpurple dark:bg-darkpurple rounded-2xl flex flex-col justify-center items-center p-3 md:hidden"
    >
      <div className="border-2 rounded-full py-2 px-5">
        Searchbar here for sprint 2
      </div>
    </section>
  );
};
