import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FOCUS_VISIBLE } from "@/lib/classNames";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import type { NavigationItem } from "@/components/Header";
import { AuthButton, ToggleTheme } from ".";

type MobileMenuProps = {
  navigation: NavigationItem[];
};

export const MobileSheetMenu = ({ navigation }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open mobile menu"
          className={
            "w-10 h-10 text-black dark:text-white cursor-pointer hover:text-white dark:hover:text-black " +
            FOCUS_VISIBLE
          }
        >
          <Bars3Icon className="w-7 h-7" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="bg-lightpurple dark:bg-darkpurple ">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl font-semibold text-black dark:text-white text-center">
            Menu
          </SheetTitle>
        </SheetHeader>
        <SheetDescription className="text-black dark:text-white text-center text-xs pb-4">
          Welcome to your hub. From here, you can explore, manage, and
          personalize your Realm experience.
        </SheetDescription>
        <section className="flex gap-4 items-center">
          <SheetClose asChild>
            <span>
              <AuthButton />
            </span>
          </SheetClose>
          <ToggleTheme />
        </section>

        <nav className="flex flex-col gap-4 mt-6 border-t border-black/10 dark:border-white/10 pt-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  to={item.href}
                  className={
                    "flex items-center gap-3 text-lg text-black dark:text-white hover:text-white dark:hover:text-black " +
                    FOCUS_VISIBLE
                  }
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                  {item.title}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
