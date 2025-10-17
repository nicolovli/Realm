// Sort dropdown for result header (desktop and mobile)
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FOCUS_VISIBLE, HOVER, PILL_TRIGGER_BASE } from "@/lib/classNames";

// Define the specific values a sort option can have
type SortOptionValue =
  | "popularity"
  | "release-date"
  | "alphabetical"
  | "rating";

// Props for the sort dropdown
interface SortDropdownProps {
  sortOption: SortOptionValue;
  setSortOption: (value: SortOptionValue) => void;
  sortOptions: Array<{ value: SortOptionValue; label: string }>;
}

// Renders the sort dropdown trigger and menu
export const SortDropdown = ({
  sortOption,
  setSortOption,
  sortOptions,
}: SortDropdownProps) => {
  const currentLabel =
    sortOptions.find((o) => o.value === sortOption)?.label ?? "Sort";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`${HOVER} ${PILL_TRIGGER_BASE} md:w-[200px] w-[177px] bg-lightpurple dark:bg-darkpurple
        `}
      >
        <span className="font-medium">{currentLabel}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className=" bg-lightpurple dark:bg-darkpurple border-gray-200 dark:border-gray-700 min-w-[var(--radix-dropdown-menu-trigger-width)]"
        align="end"
      >
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setSortOption(option.value)}
            className={`
              ${HOVER} ${FOCUS_VISIBLE} text-black dark:text-white cursor-pointer
              ${option.value === sortOption ? "bg-white/40 dark:bg-black/20 font-semibold" : ""}
            `}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
