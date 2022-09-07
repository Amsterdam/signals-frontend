import type { Filter } from '../../types'

export const updateFilterCategory = (
  categoryName: string,
  filters: Filter[]
) => {
  return filters.map((filter) => {
    if (filter.name === categoryName) {
      return {
        ...filter,
        filterActive: !filter.filterActive,
      }
    }
    return filter
  })
}
