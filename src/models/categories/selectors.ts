// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterda
import { createSelector } from 'reselect'
import { getDaysString } from 'shared/services/date-utils'
import { reCategory } from 'shared/services/resolveClassification'

import type { List as ImmutableList, Map as ImmutableMap } from 'immutable'
import type { ApplicationRootState } from 'types'
import type { Category } from 'types/category'
import type SubCategory from 'types/api/sub-category'

import { initialState } from './reducer'

export type ExtendedCategory = Category & {
  fk: string
  id: number | string
  key: string
  value: string
  parentKey: string
}

type CategoryMap = ImmutableMap<keyof Category, Category[keyof Category]>

type ExtendedCategoryMap = ImmutableMap<
  keyof ExtendedCategory,
  ExtendedCategory[keyof ExtendedCategory]
>

export type ExtendedSubCategory = ExtendedCategory &
  SubCategory & {
    extendedName: string
    category_slug: string
  }

export type StructuredCategories = Record<
  string,
  ExtendedCategory & { sub: Array<SubCategory> }
>

export const selectCategoriesDomain = (state?: ApplicationRootState) =>
  state?.categories || initialState

const mappedSequence = (
  results: ImmutableList<CategoryMap>
): ImmutableList<ExtendedCategoryMap> =>
  results
    .sort((a: CategoryMap, b: CategoryMap) => {
      const valueA = (a.get('name') || '').toString().toLowerCase()
      const valueB = (b.get('name') || '').toString().toLowerCase()

      if (valueA === valueB) return 0
      return valueA > valueB ? 1 : -1
    })
    .map(
      (category: ExtendedCategoryMap): ExtendedCategoryMap =>
        category
          .set('fk', (category.get('id') || '').toString())
          .set('id', category.getIn(['_links', 'self', 'public']) as string)
          .set('key', category.getIn(['_links', 'self', 'public']) as string)
          .set('value', category.get('name') || '')
          .set(
            'parentKey',
            (category.getIn(['_links', 'sia:parent', 'public']) as string) || ''
          )
    )

/**
 * Alphabetically sorted list of all categories, excluding inactive categories
 *
 * Category data, coming from the API, is enriched so that specific props, like `id` and `key`
 * are present in the objects that components expect to receive.
 */
export const makeSelectCategories = createSelector(
  selectCategoriesDomain,
  (state) => {
    const results = state.getIn([
      'categories',
      'results',
    ]) as ImmutableList<CategoryMap>

    if (!results) {
      return null
    }

    return mappedSequence(results).filter((category) =>
      category.get('is_active')
    )
  }
)

/**
 * Alphabetically sorted list of all categories
 *
 * @returns {IndexedIterable}
 */
export const makeSelectAllCategories = createSelector(
  selectCategoriesDomain,
  (state) => {
    const results = state.getIn([
      'categories',
      'results',
    ]) as ImmutableList<CategoryMap>

    if (!results) {
      return null
    }

    return mappedSequence(results)
  }
)

export const filterForMain = ({ _links }: Category | ExtendedCategory) =>
  _links['sia:parent'] === undefined

/**
 * Get all main categories, sorted by name
 */
export const makeSelectMainCategories = createSelector(
  makeSelectCategories,
  (state) => {
    if (!state) {
      return null
    }

    const categories = state.filter(
      (category) => category.getIn(['_links', 'sia:parent']) === undefined
    )

    return categories.toJS() as Array<ExtendedCategory>
  }
)

export const filterForSub = ({ _links }: Category) =>
  _links['sia:parent'] !== undefined

const getHasParent = (state: ImmutableList<ExtendedCategoryMap>) =>
  state.filter(
    (category) => category.getIn(['_links', 'sia:parent']) !== undefined
  )

/**
 * Get all subcategories, sorted by name, excluding inactive subcategories
 */
export const makeSelectSubCategories = createSelector(
  makeSelectCategories,
  (state) => {
    if (!state) {
      return null
    }

    const subCategories = getHasParent(state).toJS() as Array<ExtendedCategory>

    return subCategories.map(
      (subCategory: ExtendedCategory): ExtendedSubCategory => {
        const responsibleDeptCodes = subCategory.departments
          .filter(({ is_responsible }) => is_responsible)
          .map(({ code }) => code)
        let extendedName = subCategory.name

        if (responsibleDeptCodes.length > 0) {
          extendedName = `${subCategory.name} (${responsibleDeptCodes.join(
            ', '
          )})`
        }

        const [, category_slug] =
          subCategory._links.self.public.match(reCategory) || []

        return {
          ...subCategory,
          extendedName,
          category_slug,
        }
      }
    )
  }
)

export const makeSelectAllSubCategories = createSelector(
  makeSelectAllCategories,
  (state) => {
    if (!state) {
      return null
    }

    return getHasParent(state).toJS() as Array<SubCategory>
  }
)

/**
 * Get all subcategories, sorted by name, that are children of another category
 */
export const makeSelectByMainCategory = createSelector(
  makeSelectSubCategories,
  (state) =>
    (parentKey: string): Array<SubCategory> | null => {
      if (!state) {
        return null
      }

      return state.filter(
        (category: SubCategory) => category.parentKey === parentKey
      )
    }
)

/**
 * Get all subcategories, grouped by main category. Both main and subcategories are sorted by name.
 */
export const makeSelectStructuredCategories = createSelector(
  [makeSelectMainCategories, makeSelectByMainCategory],
  (main, byMain): StructuredCategories | null => {
    if (!main) {
      return null
    }

    return main.reduce(
      (acc: StructuredCategories, mainCategory: ExtendedCategory) => ({
        ...acc,
        [mainCategory.slug]: {
          ...mainCategory,
          sub: byMain(mainCategory.key) || [],
        },
      }),
      {}
    )
  }
)

type NameValue = {
  name: string
  value: string
  group?: string
}

export type SubCategoryOption = ExtendedSubCategory & NameValue
export type SubcategoriesGrouped = [Array<NameValue>, Array<SubCategoryOption>]

export const makeSelectSubcategoriesGroupedByCategories = createSelector(
  [makeSelectMainCategories, makeSelectSubCategories],
  (categories, subcategories): SubcategoriesGrouped => {
    const subcategoryGroups =
      categories?.map(
        ({ slug: value, name }: ExtendedCategory): NameValue => ({
          name,
          value,
        })
      ) || []

    const subcategoryOptions =
      subcategories?.map(
        (subcategory: ExtendedSubCategory): SubCategoryOption => ({
          ...subcategory,
          name: subcategory.extendedName,
          value: subcategory.extendedName,
          group: subcategory.category_slug,
        })
      ) || []

    return [subcategoryGroups, subcategoryOptions]
  }
)

export const makeSelectHandlingTimesBySlug = createSelector(
  makeSelectSubCategories,
  (subcategories) =>
    (subcategories || []).reduce(
      (acc: Record<string, string>, { slug, sla }: ExtendedSubCategory) => ({
        ...acc,
        [slug]: getDaysString(sla.n_days, sla.use_calendar_days),
      }),
      {}
    )
)
