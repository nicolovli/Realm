import { useEffect, useRef, type RefObject } from "react";
import type { Item } from "./Header";
import { useClickOutside } from "./useClickOutside";
import { Link } from "react-router-dom";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  items: Item[];
}

export const MobileMenu = ({
  isOpen,
  onClose,
  triggerRef,
  items,
}: NavigationMenuProps) => {
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
    <nav
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      data-testid="mobile-menu"
      className="bg-lightpurple dark:bg-darkpurple rounded-2xl flex flex-col p-6 md:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className="group flex items-center gap-3 text-xl mb-3 text-black dark:text-white hover:text-white dark:hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon aria-hidden="true" className="w-6 h-6 " />
            <section className="">{item.title}</section>
          </Link>
        );
      })}
    </nav>
  );
};
