import type { Filter } from '../../types'

export const updateFilterCategory = (
  categorySlug: string,
  filters: Filter[]
): Filter[] => {
  return filters.map((filter) => {
    if (filter.slug === categorySlug) {
      return {
        ...filter,
        filterActive: !filter.filterActive,
      }
    }
    if (filter.subCategories) {
      return {
        ...filter,
        subCategories: updateFilterCategory(categorySlug, filter.subCategories),
      }
    }
    return filter
  })
}
