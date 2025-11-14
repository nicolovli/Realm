import { Logo } from "@/assets/Logo";
import { GlobeEuropeAfricaIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import {
  AuthButton,
  MobileSheetMenu,
  SearchBar,
  ToggleTheme,
} from "@/components/Header";
import { FOCUS_VISIBLE } from "@/lib/classNames";

// Navigation Item type for Header component
export type NavigationItem = {
  title: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const navigation: NavigationItem[] = [
  {
    title: "Favorites",
    href: "/favorites",
    icon: HeartIcon,
  },
  {
    title: "Discover",
    href: "/games?sort=popularity",
    icon: GlobeEuropeAfricaIcon,
  },
];

export const Header = () => {
  return (
    <header className="sticky top-4 z-50 flex flex-col m-3 gap-2 w-[min(1600px,92%)] mx-auto">
      <section className="bg-lightpurple dark:bg-darkpurple shadow-sm rounded-full flex flex-row justify-between items-center p-3 gap-1">
        <Link to="" aria-label="Homepage" className={FOCUS_VISIBLE}>
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
        <ToggleTheme className=" hidden md:block lg:ml-5 lg:mr-5" />

        {/* Mobile icons only visible in reponsivive small size */}
        <section className="flex flex-row gap-3 w-full md:hidden items-center">
          <SearchBar />
          <MobileSheetMenu navigation={navigation} />
        </section>
      </section>
    </header>
  );
};
