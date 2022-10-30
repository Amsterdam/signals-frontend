/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import type { Category } from 'types/category'

import type { Filter, SubCategory } from '../../types'

export const getFilterCategoriesWithIcons = (
  categories: Category[]
): Filter[] => {
  const result = categories
    .filter(({ is_public_accessible }) => is_public_accessible)
    .map((category) => {
      const { sub_categories, _display, _links, name, slug } = category

      const categoriesWithIcons: Filter = {
        _display,
        filterActive: true,
        icon: _links['sia:icon']?.href,
        name,
        slug,
        nrOfIncidents: 0,
      }

      if (sub_categories && showSubCategoryFilter(category)) {
        categoriesWithIcons.subCategories = getSubCategories(sub_categories)
      }

      return categoriesWithIcons
    })

  return result
}

function showSubCategoryFilter(category: Category) {
  return ['Afval', 'Wegen, verkeer, straatmeubilair'].includes(category.name)
}

const getSubCategories = (
  subCategories: Category['sub_categories'] = []
): SubCategory[] => {
  const result = subCategories
    .filter(({ is_public_accessible }) => is_public_accessible)
    .map((subCategory) => {
      const { name, _display, slug, _links } = subCategory
      return {
        _display,
        filterActive: true,
        icon: _links['sia:icon']?.href,
        name,
        slug,
        nrOfIncidents: 0,
      }
    })

  return result
}
