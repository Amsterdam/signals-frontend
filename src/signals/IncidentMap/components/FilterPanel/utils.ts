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
      let subCategories
      const { sub_categories, _display, _links, name, slug } = category

      if (sub_categories) {
        subCategories = getSubCategories(sub_categories)
      }

      return {
        _display,
        filterActive: true,
        icon: _links['sia:icon']?.href,
        name,
        slug,
        subCategories,
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
        _display,
        filterActive: true,
        icon: _links['sia:icon']?.href,
        name,
        slug,
      }
    })

  return result
}
