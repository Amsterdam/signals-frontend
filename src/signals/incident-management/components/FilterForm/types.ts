type FilterValue = string | string[]

export type SelectedFilters = { [key: string]: FilterValue }
export type StoredParams = {
  [key: string]: FilterValue | number
}

export interface FilterFormData {
  name?: string
  refresh: boolean
  options: Record<string, any>
}
