type FilterValue = string | string[]

export type SelectedFilters = { [key: string]: FilterValue }
export type StoredParams = {
  [key: string]: FilterValue | number
}
