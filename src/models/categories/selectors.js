// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Seq } from 'immutable'
import { createSelector } from 'reselect'
import { getDaysString } from 'shared/services/date-utils'
import { reCategory } from 'shared/services/resolveClassification'

import { initialState } from './reducer'

export const selectCategoriesDomain = (state) =>
  state?.categories || initialState

const mappedSequence = (results) =>
  Seq(results)
    .sort((a, b) =>
      a.get('name').toLowerCase() > b.get('name').toLowerCase() ? 1 : -1
    )
    .map((category) =>
      category
        .set('fk', category.get('id'))
        .set('id', category.getIn(['_links', 'self', 'public']))
        .set('key', category.getIn(['_links', 'self', 'public']))
        .set('value', category.get('name'))
        .set(
          'parentKey',
          category.hasIn(['_links', 'sia:parent']) &&
            category.getIn(['_links', 'sia:parent', 'public'])
        )
    )

/**
 * Alphabetically sorted list of all categories, excluding inactive categories
 *
 * Category data, coming from the API, is enriched so that specific props, like `id` and `key`
 * are present in the objects that components expect to receive.
 *
 * @returns {IndexedIterable}
 */
export const makeSelectCategories = createSelector(
  selectCategoriesDomain,
  (state) => {
    const results = state.getIn(['categories', 'results'])

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
    const results = state.getIn(['categories', 'results'])

    if (!results) {
      return null
    }

    return mappedSequence(results)
  }
)

export const filterForMain = ({ _links }) => _links['sia:parent'] === undefined

/**
 * Get all main categories, sorted by name
 *
 * @returns {Object[]}
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

    return categories.toJS()
  }
)

export const filterForSub = ({ _links }) => _links['sia:parent'] !== undefined

const getHasParent = (state) =>
  state.filter(
    (category) => category.getIn(['_links', 'sia:parent']) !== undefined
  )

/**
 * Get all subcategories, sorted by name, excluding inactive subcategories
 *
 * @returns {Object[]}
 */
export const makeSelectSubCategories = createSelector(
  makeSelectCategories,
  (state) => {
    if (!state) {
      return null
    }

    const subCategories = getHasParent(state).toJS()

    return subCategories.map((subCategory) => {
      const responsibleDeptCodes = subCategory.departments
        .filter(({ is_responsible }) => is_responsible)
        .map(({ code }) => code)
      let extendedName = subCategory.name

      if (responsibleDeptCodes.length > 0) {
        extendedName = `${subCategory.name} (${responsibleDeptCodes.join(
          ', '
        )})`
      }

      const [, category_slug] = subCategory._links.self.public.match(reCategory)

      return {
        ...subCategory,
        extendedName,
        category_slug,
      }
    })
  }
)

export const makeSelectAllSubCategories = createSelector(
  makeSelectAllCategories,
  (state) => {
    if (!state) {
      return null
    }

    return getHasParent(state).toJS()
  }
)

/**
 * Get all subcategories, sorted by name, that are children of another category
 *
 * @param {String} parentKey - Main category public identifier
 * @returns {Object[]}
 */
export const makeSelectByMainCategory = createSelector(
  makeSelectSubCategories,
  (state) => (parentKey) => {
    if (!state) {
      return null
    }

    return state.filter((category) => category.parentKey === parentKey)
  }
)

/**
 * Get all subcategories, grouped by main category. Both main and subcategories are sorted by name.
 *
 * @returns {Object}
 */
export const makeSelectStructuredCategories = createSelector(
  [makeSelectMainCategories, makeSelectByMainCategory],
  (main, byMain) => {
    if (!main) {
      return null
    }

    return main.reduce(
      (acc, mainCategory) => ({
        ...acc,
        [mainCategory.slug]: { ...mainCategory, sub: byMain(mainCategory.key) },
      }),
      {}
    )
  }
)

export const makeSelectSubcategoriesGroupedByCategories = createSelector(
  [makeSelectMainCategories, makeSelectSubCategories],
  (categories, subcategories) => {
    const subcategoryGroups = categories?.map(({ slug: value, name }) => ({
      name,
      value,
    }))
    const subcategoryOptions = subcategories?.map((subcategory) => ({
      ...subcategory,
      name: subcategory.extendedName,
      value: subcategory.extendedName,
      group: subcategory.category_slug,
    }))
    return [subcategoryGroups, subcategoryOptions]
  }
)

export const makeSelectHandlingTimesBySlug = createSelector(
  makeSelectSubCategories,
  (subcategories) =>
    (subcategories || []).reduce(
      (acc, { slug, sla }) => ({
        ...acc,
        [slug]: getDaysString(sla.n_days, sla.use_calendar_days),
      }),
      {}
    )
)
