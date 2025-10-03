import { useRef, useState, type ComponentType, type SVGProps } from "react";
import { Logo } from "../../assets/Logo";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  // GlobeEuropeAfricaIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { MobileSearchMenu } from "./MobileSearchMenu";
import { MobileMenu } from "./MobileMenu";

const icon_classname =
  "w-8 h-8 text-black dark:text-white cursor-pointer hover:text-white dark:hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500";

const focus = "focus:outline-none focus:ring-2 focus:ring-blue-500";

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
  // {
  //   title: "Discover",
  //   href: "/result",
  //   icon: GlobeEuropeAfricaIcon,
  // },
];

export const Header = () => {
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const searchIconRef = useRef<HTMLButtonElement>(null);
  const barIconRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="sticky top-4 z-50 flex flex-col m-3 gap-2 w-[min(1600px,92%)] mx-auto">
      <section className="bg-lightpurple dark:bg-darkpurple shadow-sm rounded-full flex flex-row justify-between items-center p-3 gap-1">
        <Link to="/" aria-label="Homepage" className={focus}>
          <Logo
            size={50}
            className="text-black dark:text-white hover:text-white dark:hover:text-black"
          />
        </Link>

        {/* Dekstop navigation + search, hidden in mobile version */}
        <section className="hidden md:flex flex-1 items-center gap-6">
          {/* TODO: Add searchbar here */}
          <div className="border-2 rounded-full py-2 px-5 w-64 md:w-fit md:ml-10">
            Searchbar here for sprint2
          </div>

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
                    focus
                  }
                >
                  <Icon aria-hidden="true" className="w-6 h-6" />
                  <section>{item.title}</section>
                </Link>
              );
            })}
          </nav>
        </section>

        <Link
          to="/login"
          className={
            "hidden md:flex md:flex-row items-center gap-1 bg-lightbuttonpurple dark:bg-darkbuttonpurple rounded-full text-white py-3 px-5 hover:bg-darkbuttonpurple dark:hover:bg-lightbuttonpurple " +
            focus
          }
        >
          <ArrowRightStartOnRectangleIcon
            aria-hidden="true"
            className="w-5 h-5"
          />
          Login
        </Link>

        {/* TODO: Need to implement darkmode before switching the sun to moon icon */}
        <button
          aria-label="Toggle dark mode"
          className={icon_classname + " hidden md:block lg:ml-5 lg:mr-5"}
        >
          <SunIcon aria-hidden="true" />
        </button>

        {/* Mobile icons only visible in reponsivive small size */}
        <section className="flex flex-row gap-2 mr-2 md:hidden items-center">
          <Link
            to="/login"
            className={
              "flex items-center gap-1 bg-lightbuttonpurple dark:bg-darkbuttonpurple rounded-full text-white py-3 px-5 hover:bg-darkbuttonpurple dark:hover:bg-lightbuttonpurple md:invisible " +
              focus
            }
          >
            <ArrowRightStartOnRectangleIcon
              aria-hidden="true"
              className="w-5 h-5"
            />
            Login
          </Link>
          <button
            ref={searchIconRef}
            className={icon_classname}
            onClick={() => setShowSearchMenu((prev) => !prev)}
            aria-label="Open search menu"
            aria-expanded={showSearchMenu}
          >
            <MagnifyingGlassIcon aria-hidden="true" />
          </button>

          {/* TODO: Need to implement darkmode before switching the sun to moon icon */}
          <button
            className={icon_classname + " md:hidden"}
            aria-label="Toggle dark mode"
          >
            <SunIcon aria-hidden="true" />
          </button>

          <button
            ref={barIconRef}
            aria-label="Open menu"
            aria-expanded={showMenu}
            className={icon_classname}
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
