// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import {
  mainCategories as mainCategoriesFixture,
  subCategories as subCategoriesFixture,
} from 'utils/__tests__/fixtures'

import categoriesJson from 'utils/__tests__/fixtures/categories_private.json'

import { initialState } from './reducer'
import {
  filterForMain,
  filterForSub,
  makeSelectAllCategories,
  makeSelectAllSubCategories,
  makeSelectByMainCategory,
  makeSelectCategories,
  makeSelectHandlingTimesBySlug,
  makeSelectMainCategories,
  makeSelectStructuredCategories,
  makeSelectSubCategories,
  makeSelectSubcategoriesGroupedByCategories,
  selectCategoriesDomain,
} from './selectors'

const state = fromJS({
  error: false,
  errorMessage: false,
  categories: categoriesJson,
  loading: false,
})

describe('models/categories/selectors', () => {
  test('selectCategoriesDomain', () => {
    expect(selectCategoriesDomain()).toEqual(initialState)

    const categoriesDomain = {
      categories: state,
    }

    expect(selectCategoriesDomain(categoriesDomain)).toEqual(state)
  })

  test('makeSelectCategories', () => {
    expect(makeSelectCategories.resultFunc(initialState)).toBeNull()

    const categories = makeSelectCategories.resultFunc(state)
    const first = categories.first().toJS()

    const firstWithExtraProps = categoriesJson.results[0]
    firstWithExtraProps.fk = firstWithExtraProps.id
    firstWithExtraProps.id = firstWithExtraProps._links.self.public
    firstWithExtraProps.key = firstWithExtraProps._links.self.public
    firstWithExtraProps.parentKey = false
    firstWithExtraProps.value = firstWithExtraProps.name

    expect(first).toEqual(firstWithExtraProps)

    const second = categories.skip(1).first().toJS()

    const secondWithExtraProps = categoriesJson.results[1]
    secondWithExtraProps.fk = secondWithExtraProps.id
    secondWithExtraProps.id = secondWithExtraProps._links.self.public
    secondWithExtraProps.key = secondWithExtraProps._links.self.public
    secondWithExtraProps.parentKey =
      secondWithExtraProps._links['sia:parent'].public
    secondWithExtraProps.value = secondWithExtraProps.name

    expect(second).toEqual(secondWithExtraProps)
  })

  test('makeSelectCategories should only return active categories', () => {
    const total = categoriesJson.results.length
    const inactive = categoriesJson.results.filter(
      ({ is_active }) => !is_active
    ).length

    const result = makeSelectCategories.resultFunc(state).toJS()

    expect(result.length).toEqual(total - inactive)

    result.forEach((category) => {
      expect(category.is_active).toEqual(true)
    })
  })

  test('makeSelectAllCategories', () => {
    const total = categoriesJson.results.length
    expect(makeSelectAllCategories.resultFunc(initialState)).toBeNull()

    const result = makeSelectAllCategories.resultFunc(state)

    expect(result.toJS().length).toEqual(total)
  })

  test('makeSelectMainCategories', () => {
    expect(makeSelectMainCategories.resultFunc()).toBeNull()

    const mainCategories = makeSelectMainCategories.resultFunc(
      makeSelectCategories.resultFunc(state)
    )
    const slugs = mainCategories.map(({ slug }) => slug)
    const keys = categoriesJson.results
      .filter(filterForMain)
      .map(({ slug }) => slug)

    expect(slugs).toEqual(keys)
  })

  test('makeSelectSubCategories', () => {
    expect(makeSelectSubCategories.resultFunc()).toBeNull()

    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(state)
    )
    const slugs = subCategories.map(({ slug }) => slug).sort()
    const keys = categoriesJson.results
      .filter(filterForSub)
      .filter(({ is_active }) => is_active)
      .map(({ slug }) => slug)
      .sort()

    expect(slugs).toEqual(keys)
  })

  test('makeSelectSubCategories extendedName', () => {
    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(state)
    )

    const subCatWithResponsibleDepts = subCategories.find(
      ({ departments }) =>
        departments.filter(({ is_responsible }) => is_responsible).length > 0
    )
    const deptCodes = subCatWithResponsibleDepts.departments.map(
      ({ code }) => code
    )

    deptCodes.forEach((code) => {
      expect(subCatWithResponsibleDepts.extendedName.indexOf(code) > 0)
    })
  })

  test('makeSelectAllSubCategories', () => {
    expect(makeSelectAllSubCategories.resultFunc()).toBeNull()

    const subCategories = makeSelectAllSubCategories.resultFunc(
      makeSelectAllCategories.resultFunc(state)
    )
    const slugs = subCategories.map(({ slug }) => slug).sort()
    const keys = categoriesJson.results
      .filter(filterForSub)
      .map(({ slug }) => slug)
      .sort()

    expect(slugs).toEqual(keys)
  })

  test('makeSelectByMainCategory', () => {
    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(state)
    )

    const parentKey = categoriesJson.results[0]._links.self.public
    const count = subCategories.filter(
      ({ _links }) => _links['sia:parent'].public === parentKey
    ).length

    expect(makeSelectByMainCategory.resultFunc()(parentKey)).toBeNull()

    expect(
      makeSelectByMainCategory.resultFunc(subCategories)(parentKey)
    ).toHaveLength(count)
  })

  test('makeSelectStructuredCategories', () => {
    const mainCategories = categoriesJson.results.filter(filterForMain)
    const count = categoriesJson.results.filter(filterForMain).length
    const structuredCategories = makeSelectStructuredCategories.resultFunc(
      mainCategories,
      makeSelectByMainCategory.resultFunc
    )

    expect(makeSelectStructuredCategories.resultFunc()).toBeNull()

    expect(Object.keys(structuredCategories)).toHaveLength(count)
  })

  test('makeSelectSubcategoriesGroupedByCategories', () => {
    const subcategoriesGroupedByCategories =
      makeSelectSubcategoriesGroupedByCategories.resultFunc(
        mainCategoriesFixture,
        subCategoriesFixture
      )

    expect(Object.keys(subcategoriesGroupedByCategories)).toHaveLength(2)
    const [subcategoryGroups, subcategoryOptions] =
      subcategoriesGroupedByCategories
    expect(subcategoryGroups.length).toEqual(mainCategoriesFixture.length)
    expect(subcategoryOptions.length).toEqual(subCategoriesFixture.length)
    subcategoryOptions.forEach(
      ({ name, value, extendedName, category_slug, group }) => {
        expect(name).toEqual(extendedName)
        expect(value).toEqual(extendedName)
        expect(group).toEqual(category_slug)
      }
    )
  })

  test('handlingTimesBySlug', () => {
    const handlingTimesBySlug =
      makeSelectHandlingTimesBySlug.resultFunc(subCategoriesFixture)

    expect(handlingTimesBySlug['afwatering-brug']).toBe('5 werkdagen')
    expect(handlingTimesBySlug['auto-scooter-bromfietswrak']).toBe('21 dagen')
  })
})
