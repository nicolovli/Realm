// Shared className constants

export const FOCUS_VISIBLE =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-lightpurple dark:focus-visible:ring-offset-darkpurple ";

//Example: Disabled options in dropdowns
export const DISABLED =
  "disabled:opacity-20 disabled:cursor-not-allowed disabled:pointer-events-none ";

//Example: Hover effect on clear all button
export const HOVER =
  "relative overflow-hidden " +
  "before:absolute before:inset-0 before:rounded-inherit before:bg-current before:opacity-0 " +
  "before:transition-opacity before:duration-150 " +
  "hover:before:opacity-20 dark:hover:before:opacity-20 " +
  "active:before:opacity-20 " +
  "before:pointer-events-none " +
  "motion-reduce:before:transition-none ";

//Example: clear all button
export const BUTTON_BASE =
  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black dark:text-white shadow-sm cursor-pointer ";

// Example: Active filter chips
export const CHIP_BASE =
  "inline-flex items-center gap-2 rounded-full bg-gray dark:bg-white/70 px-3 py-1 text-sm text-black shadow-sm ";

//Example: x on active filter chip
export const ICON_BUTTON =
  "inline-flex items-center justify-center rounded-full bg-black/10 p-1 dark:text-white dark:bg-darkpurple hover:bg-black/20 cursor-pointer ";

// Example: Dropdown pill(button) trigger
export const PILL_TRIGGER_BASE =
  "inline-flex items-center justify-between gap-3 rounded-xl px-5 py-2 text-left text-black dark:text-white bg-lightbuttonpurple dark:bg-darkbuttonpurple shadow-sm cursor-pointer flex-shrink-0 ";
// Navbar icons
export const ICON_CLASSNAME =
  "w-8 h-8 text-black dark:text-white cursor-pointer hover:text-white dark:hover:text-black ";

// InformationCards
export const CARD_CONTAINER =
  "flex flex-col items-center w-full max-w-[1600px] mx-auto ";

// Loading... or error classnames
export const LOADINGandERROR =
  "text-black dark:text-white flex justify-center text-2xl ";
