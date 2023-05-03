/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 - 2023 Gemeente Amsterdam */
import { defaultIcon } from 'shared/services/configuration/map-markers'
import type { Category } from 'types/category'
import type { SubCategory as SubCategoryBackend } from 'types/category'

import type { Filter, SubCategory } from '../../types'

export const getFilterCategoriesWithIcons = (
  categories: Category[]
): Filter[] =>
  categories
    .filter(({ is_public_accessible }) => is_public_accessible)
    .map((category) => {
      const { sub_categories, _display, _links, name, slug, configuration } =
        category

      const categoryWithIcon: Filter = {
        _display,
        filterActive: true,
        icon: _links['sia:icon']?.href ?? defaultIcon,
        name,
        slug,
        incidentsCount: 0,
      }

      if (sub_categories) {
        const subCategories = getSubCategories(sub_categories)

        if (
          subCategories.length > 0 &&
          configuration?.show_children_in_filter
        ) {
          categoryWithIcon.subCategories = subCategories
          categoryWithIcon.show_children_in_filter =
            configuration.show_children_in_filter
        }

        if (subCategories.length === 0) {
          // Remove category filter without public_accessible subcategories
          categoryWithIcon.filterActive = false
        }
      }

      return categoryWithIcon
    })
    .filter((category) => category.filterActive)

const getSubCategories = (subCategories: SubCategoryBackend[]): SubCategory[] =>
  subCategories
    .filter(({ is_public_accessible }) => is_public_accessible)
    .map((subCategory) => {
      const { name, _display, slug, _links } = subCategory
      return {
        _display,
        filterActive: true,
        icon: _links['sia:icon']?.href ?? defaultIcon,
        name,
        slug,
        incidentsCount: 0,
      }
    })

export const showSubCategoryFilter = (array: string[], slug: string) =>
  array.includes(slug)
