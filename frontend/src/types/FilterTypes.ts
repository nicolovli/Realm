// Filter-related types
export type FilterKey =
  | "genres"
  | "tags"
  | "categories"
  | "platforms"
  | "publisher";

export type FiltersMap = Record<FilterKey, string[]>;

export type SelectedFilters = Record<FilterKey, string[]>;

export type FilterOption = {
  id: string;
  name: string;
};

export type FilterOptionWithAvailability = {
  id: string;
  name: string;
  disabled: boolean;
};

export type FilterGroup = {
  key: FilterKey;
  label: string;
};
