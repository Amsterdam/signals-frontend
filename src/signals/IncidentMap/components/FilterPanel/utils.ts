import type { Category } from 'types/category'

import type { Filter, SubCategory } from '../../types'

export const getFilterCategoriesWithIcons = (
  categories: Category[]
): Filter[] => {
  const result = categories
    .filter(({ is_public_accessible }) => is_public_accessible)
    .map((category) => {
      let sub_categories

      if (category?.sub_categories) {
        sub_categories = getSubCategories(category.sub_categories)
      }

      return {
        _display: category._display,
        filterActive: true,
        icon: category._links['sia:icon']?.href,
        name: category.name,
        slug: category.slug,
        subCategories: sub_categories,
      }
    })

  return result
}

const getSubCategories = (
  subCategories: Category['sub_categories'] = []
): SubCategory[] => {
  const result = subCategories
    .filter(({ is_public_accessible }) => is_public_accessible)
    .map((subCategory) => {
      const { name, _display, slug, _links } = subCategory
      return {
        _display: _display,
        filterActive: true,
        icon: _links['sia:icon']?.href,
        name: name,
        slug: slug,
      }
    })

  return result
}
