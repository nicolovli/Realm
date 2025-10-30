import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FOCUS_VISIBLE,
  HOVER,
  PILL_TRIGGER_BASE,
  DISABLED,
} from "@/lib/classNames";
import { useState } from "react";

interface FilterPillProps {
  label: string;
  options: Array<{ name: string; disabled: boolean }>;
  selectedValues: string[];
  isLoading?: boolean;
  filtersReady?: boolean;
  onToggle: (value: string) => void;
  disabled?: boolean;
}

export const FilterPill = ({
  label,
  options,
  selectedValues,
  isLoading = false,
  filtersReady = true,
  onToggle,
  disabled = false,
}: FilterPillProps) => {
  const [open, setOpen] = useState(false);
  const isReady = filtersReady && options.length > 0;
  const isDisabled = disabled || isLoading || !isReady;

  // Add "All" as first option if ready
  const optionsWithAll = isReady
    ? [{ name: "All", disabled: false }, ...options]
    : [];

  const handleOptionToggle = (option: string) => {
    onToggle(option);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        disabled={isDisabled}
        aria-label={`Filter by ${label}`}
        aria-expanded={open}
        className={`
          ${FOCUS_VISIBLE}
          ${HOVER}
          ${PILL_TRIGGER_BASE}
          ${DISABLED}
          md:bg-lightpurple md:dark:bg-darkpurple
        `}
      >
        <span className="font-medium flex items-center gap-2">{label}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      {isReady && (
        <DropdownMenuContent
          className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-80 overflow-y-auto bg-lightpurple dark:bg-darkpurple border-none z-100"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {optionsWithAll.map((option) => {
            const isSelected =
              option.name === "All"
                ? selectedValues.length === 0
                : selectedValues.includes(option.name);
            const isDisabled = option.disabled && !isSelected;

            const disabledClass = isDisabled
              ? "opacity-40 cursor-not-allowed pointer-events-none"
              : "cursor-pointer";

            return (
              <DropdownMenuCheckboxItem
                key={option.name}
                checked={isSelected}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                title={
                  isDisabled ? "No matching results for this option" : undefined
                }
                onCheckedChange={() =>
                  !isDisabled && handleOptionToggle(option.name)
                }
                onSelect={(event) => {
                  event.preventDefault();
                }}
                className={`
                  ${FOCUS_VISIBLE}
                  ${HOVER}
                  text-black dark:text-white my-1 
                  ${disabledClass}
                  ${isSelected ? "bg-white/40 dark:bg-black/20 font-bold" : ""}
                `}
              >
                <span>{option.name}</span>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
