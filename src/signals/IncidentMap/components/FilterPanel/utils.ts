import type { Category } from 'types/category'

import type { Filter, SubCategory } from '../../types'

export const getFilterCategoriesWithIcons = (
  categories: Category[]
): Filter[] => {
  const result = categories
    .filter(({ is_public_accessible }) => is_public_accessible)
    .map((category) => {
      const { _display, _links, name, slug } = category
      let sub_categories

      if (sub_categories) {
        sub_categories = getSubCategories(sub_categories)
      }

      return {
        _display: _display,
        filterActive: true,
        icon: _links['sia:icon']?.href,
        name: name,
        slug: slug,
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
        name,
        slug,
      }
    })

  return result
}
