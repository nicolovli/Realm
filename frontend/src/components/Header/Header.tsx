import { useRef, useState, type ComponentType, type SVGProps } from "react";
import { Logo } from "../../assets/Logo";
import {
  Bars3Icon,
  GlobeEuropeAfricaIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AuthButton, MobileMenu, MobileSearchMenu, SearchBar } from "./";
import { FOCUS_VISIBLE, ICON_CLASSNAME } from "../../lib/classNames";
import { ToggleTheme } from "./ToggleTheme";

export type Item = {
  title: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const navigation: Item[] = [
  {
    title: "Favorites",
    href: "/favorites",
    icon: HeartIcon,
  },
  {
    title: "Discover",
    href: "/games",
    icon: GlobeEuropeAfricaIcon,
  },
];

export const Header = () => {
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const searchIconRef = useRef<HTMLButtonElement>(null);
  const barIconRef = useRef<HTMLButtonElement>(null);

  return (
    <header
      className="sticky top-4 z-50 flex flex-col m-3 gap-2 w-[min(1600px,92%)] mx-auto"
      tabIndex={0}
    >
      <section className="bg-lightpurple dark:bg-darkpurple shadow-sm rounded-full flex flex-row justify-between items-center p-3 gap-1">
        <Link to="/" aria-label="Homepage" className={FOCUS_VISIBLE}>
          <Logo
            size={50}
            className="text-black dark:text-white hover:text-white dark:hover:text-black"
          />
        </Link>

        {/* Dekstop navigation + search, hidden in mobile version */}
        <section className="hidden md:flex flex-1 items-center gap-6">
          <SearchBar
            placeholder="Search for games, tags, genres..."
            className="flex-1 max-w-md ml-6"
          />

          <nav
            aria-label="Main Navigation"
            className="flex justify-center items-center gap-4"
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={
                    "group flex items-center text-black dark:text-white hover:text-white dark:hover:text-black gap-1 " +
                    FOCUS_VISIBLE
                  }
                >
                  <Icon aria-hidden="true" className="w-6 h-6" />
                  <section>{item.title}</section>
                </Link>
              );
            })}
          </nav>
        </section>

        <AuthButton className="hidden md:flex md:flex-row" />

        <ToggleTheme className="hidden md:block lg:ml-5 lg:mr-5" />

        {/* Mobile icons only visible in reponsivive small size */}
        <section className="flex flex-row gap-2 mr-2 md:hidden items-center">
          <AuthButton className="flex md:invisible" />

          <button
            ref={searchIconRef}
            className={ICON_CLASSNAME}
            onClick={() => setShowSearchMenu((prev) => !prev)}
            aria-label="Open search menu"
            aria-expanded={showSearchMenu}
          >
            <MagnifyingGlassIcon aria-hidden="true" />
          </button>

          <ToggleTheme className="md:hidden" />

          <button
            ref={barIconRef}
            aria-label="Open menu"
            aria-expanded={showMenu}
            className={ICON_CLASSNAME}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <Bars3Icon aria-hidden="true" />
          </button>
        </section>
      </section>

      {/* Dropdown search menu */}
      <MobileSearchMenu
        isOpen={showSearchMenu}
        onClose={() => setShowSearchMenu(false)}
        triggerRef={searchIconRef}
      />

      {/* Dropdown menu */}
      <MobileMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        triggerRef={barIconRef}
        items={navigation}
      />
    </header>
  );
};
