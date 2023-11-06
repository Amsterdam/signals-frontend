type FilterValue = string | string[]

export type SelectedFilters = { [key: string]: FilterValue }
export type StoredParams = {
  [key: string]: FilterValue | number
}

export interface Filter {
  name: string
  options: Record<string, any>
}
export interface FilterFormData {
  id?: number
  name?: string
  refresh: boolean
  options: Record<string, any>
}

export interface User {
  username: string
}

export interface UserOptions {
  count: number
  results: User[]
}
