import type { KeyboardEvent, RefObject } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HOVER } from "@/lib/classNames";

type SearchBarInputProps = {
  term: string;
  placeholder: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
};

export const SearchBarInput = ({
  term,
  placeholder,
  inputRef,
  onChange,
  onFocus,
  onKeyDown,
  onClear,
}: SearchBarInputProps) => {
  const showClear = term.length > 0;

  return (
    <section className="relative flex items-center bg-lightsearchbargray dark:bg-darksearchbargray rounded-full shadow-sm overflow-hidden">
      <input
        ref={inputRef}
        aria-label="Search for games"
        placeholder={placeholder}
        value={term}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className="flex-1 w-full px-4 py-3 outline-none bg-transparent text-black dark:text-white placeholder-lightgray text-sm"
        name="search"
        autoComplete="off"
      />

      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="flex-shrink-0 p-3 text-lightgray dark:text-darkgray hover:text-black dark:hover:text-white"
          aria-label="Clear search"
        >
          <XMarkIcon className="w-4 h-4 cursor-pointer" />
        </button>
      )}

      <button
        type="submit"
        className={`flex-shrink-0 bg-lightbuttonpurple dark:bg-darkbuttonpurple text-white p-3 cursor-pointer ${HOVER}`}
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>
    </section>
  );
};
