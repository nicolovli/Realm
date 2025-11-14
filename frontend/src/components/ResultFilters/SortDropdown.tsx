// Sort dropdown for result header (desktop and mobile)
import { ChevronDown } from "lucide-react";
import type { SortOptionValue } from "@/constants/resultFiltersConstants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FOCUS_VISIBLE, HOVER, PILL_TRIGGER_BASE } from "@/lib/classNames";

// SortDropdown component props
export interface SortDropdownProps {
  sortOption: SortOptionValue;
  order: "asc" | "desc";
  setSortOption: (value: SortOptionValue) => void;
  sortOptions: Array<{
    value: string;
    label: string;
    sortValue: SortOptionValue;
    order: "asc" | "desc";
    onSelect: () => void;
  }>;
}

// Renders the sort dropdown trigger and menu
export const SortDropdown = ({
  sortOption,
  order,
  setSortOption,
  sortOptions,
}: SortDropdownProps) => {
  const currentLabel =
    sortOptions.find((o) => o.sortValue === sortOption && o.order === order)
      ?.label ??
    sortOptions.find((o) => o.sortValue === sortOption)?.label ??
    "Sort";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`${HOVER} ${PILL_TRIGGER_BASE} md:w-[200px] w-[177px] bg-lightpurple dark:bg-darkpurple whitespace-nowrap`}
        aria-haspopup="menu"
        aria-label={`Sort by ${currentLabel}`}
        data-cy="sort-dropdown-trigger"
      >
        <span className="md:font-medium font-semibold">{currentLabel}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className=" bg-lightpurple dark:bg-darkpurple border-gray-200 dark:border-gray-700 min-w-[var(--radix-dropdown-menu-trigger-width)]"
        align="end"
        data-cy="sort-dropdown-menu"
      >
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            aria-checked={
              !!(
                option.sortValue === sortOption &&
                option.order &&
                order === option.order
              )
            }
            onClick={() => {
              if (option.onSelect) {
                option.onSelect();
                return;
              }
              if (setSortOption && option.sortValue) {
                setSortOption(option.sortValue);
              }
            }}
            title={option.label}
            className={`
              ${HOVER} ${FOCUS_VISIBLE} text-black dark:text-white cursor-pointer
              ${option.sortValue === sortOption && option.order === order ? "bg-white/40 dark:bg-black/20 font-semibold" : ""}
            `}
            data-cy={`sort-option-${option.sortValue}-${option.order}`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
