// Shared className constants

export const FOCUS_VISIBLE = " focus-visible:outline-blue ";

//Example: Disabled options in dropdowns
export const DISABLED = "disabled:opacity-20 disabled:cursor-not-allowed";

//Example: Hover effect on clear all button
export const HOVER =
  "relative overflow-hidden before:absolute before:inset-0 before:bg-transparent before:duration-200 hover:before:bg-black/10 dark:hover:before:bg-white/20 before:pointer-events-none";

//Example: clear all button
export const BUTTON_BASE =
  "inline-flex items-center gap-2 rounded-full bg-lightpurple dark:bg-darkpurple px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black dark:text-white shadow-sm cursor-pointer ";

// Example: Active filter chips
export const CHIP_BASE =
  "inline-flex items-center gap-2 rounded-full bg-gray dark:bg-white/70 px-3 py-1 text-sm text-black shadow-sm";

//Example: x on active filter chip
export const ICON_BUTTON =
  "inline-flex items-center justify-center rounded-full bg-black/10 p-1 dark:text-white dark:bg-darkpurple hover:bg-black/20 cursor-pointer";

// Example: Dropdown pill(button) trigger
export const PILL_TRIGGER_BASE =
  "inline-flex items-center justify-between gap-3 rounded-xl px-5 py-2 text-left text-black dark:text-white bg-lightbuttonpurple dark:bg-darkbuttonpurple shadow-sm cursor-pointer";

// Navbar icons
export const ICON_CLASSNAME =
  "w-8 h-8 text-black dark:text-white cursor-pointer hover:text-white dark:hover:text-black";

// InformationCards
export const CARD_CONTAINER =
  "flex flex-col items-center w-full max-w-[1600px] mx-auto";

// Loading... or error classnames
export const LOADINGandERROR =
  "text-black dark:text-white flex justify-center text-2xl";
