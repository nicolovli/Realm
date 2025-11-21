// Shared className constants

export const FOCUS_VISIBLE =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-lightpurple dark:focus-visible:ring-offset-darkpurple ";

//Example: Disabled options in dropdowns
export const DISABLED =
  "disabled:opacity-20 disabled:cursor-not-allowed disabled:pointer-events-none ";

// Example: Hover effect on dots
export const HOVER_DOTS =
  "hover:bg-activelightdots dark:hover:bg-darkbuttonpurple cursor-pointer ";

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
export const SORT_TRIGGER_BASE =
  "inline-flex items-center justify-between rounded-xl px-4 py-2 text-left text-black dark:text-white bg-lightbuttonpurple dark:bg-darkbuttonpurple shadow-sm cursor-pointer flex-shrink-0 ";

// Navbar icons
export const ICON_CLASSNAME =
  "w-8 h-8 text-black dark:text-white cursor-pointer hover:text-white dark:hover:text-black ";

// InformationCards
export const CARD_CONTAINER =
  "flex flex-col items-center w-full max-w-[1600px] mx-auto ";

// Card border styling
export const CARD_BORDER =
  "bg-surface-elevated dark:bg-dark-surface-elevated " +
  "border border-transparent " +
  "shadow-md shadow-black/15 dark:shadow-black/40 " +
  "hover:shadow-lg hover:shadow-black/25 dark:hover:shadow-black/60 " +
  "transition-shadow " +
  "relative overflow-hidden";

/*
  "bg-lightpurple dark:bg-darkpurple " +
  "ring-1 ring-gray/60 dark:ring-darkgray/40 " +
  "relative overflow-hidden";
*/
// Card hover gradient effect (for image)
export const IMAGE_HOVER_GRADIENT =
  "after:absolute after:bottom-0 after:left-0 after:right-0 " +
  "after:h-24 after:bg-gradient-to-t after:from-black/40 after:to-transparent " +
  "after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none";

// Loading... or error classnames
export const LOADINGandERROR =
  "text-black dark:text-white flex justify-center text-2xl ";

// Elevated element shadow scaling (SM for buttons, small cards, chips, etc. MD for larger cards and containers, LG for modals, etc)
export const SHADOW_SM = "shadow-sm dark:shadow-[0_2px_10px_rgb(0,0,0,0.2)]";
export const SHADOW_MD = "shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]";
export const SHADOW_LG = "shadow-lg dark:shadow-[0_15px_50px_rgb(0,0,0,0.9)]";

// Elevated container styling (lifts content from background with subtle styling)
export const ELEVATED_CONTAINER =
  "bg-surface dark:bg-dark-surface-elevated " +
  "ring-1 ring-border-subtle/80 dark:ring-white/10 " +
  "rounded-3xl p-6 md:p-8 " +
  SHADOW_SM;

// Sunken / embedded container
export const SUNKEN_CONTAINER =
  "bg-surface dark:bg-ashygray " + // slightly darker than page
  "ring-1 ring-border-subtle/80 dark:ring-black/40 " +
  "rounded-2xl shadow-inner";
