import type { Filter } from '../FilterPanel'

export const updateFilterCategories = (
  categoryName: string,
  categories: Filter[]
) => {
  return categories.map((category) => {
    if (category.name === categoryName) {
      return {
        ...category,
        filterActive: !category.filterActive,
      }
    }
    return category
  })
}
