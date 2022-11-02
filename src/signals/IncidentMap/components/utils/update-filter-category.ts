import type { Filter } from '../../types'

export const updateFilterCategory = (
  categoryName: string,
  filters: Filter[]
): Filter[] => {
  return filters.map((filter) => {
    if (filter.name === categoryName) {
      return {
        ...filter,
        filterActive: !filter.filterActive,
      }
    }
    if (filter.subCategories) {
      return {
        ...filter,
        subCategories: updateFilterCategory(categoryName, filter.subCategories),
      }
    }
    return filter
  })
}
