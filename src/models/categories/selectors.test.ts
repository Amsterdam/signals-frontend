// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import {
  mainCategories as mainCategoriesFixture,
  subCategories as subCategoriesFixture,
} from 'utils/__tests__/fixtures'
import categoriesJson from 'utils/__tests__/fixtures/categories_private.json'
import { initialState as initialAppState } from 'containers/App/reducer'

import type CategoriesType from 'types/api/categories'
import type { CategoriesState } from './reducer'
import type { ExtendedCategory, SubCategoryOption } from './selectors'

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

const categoriesFixture: CategoriesType = categoriesJson

const categoriesState = fromJS({
  error: false,
  categories: categoriesFixture,
  loading: false,
}) as CategoriesState

describe('models/categories/selectors', () => {
  test('selectCategoriesDomain', () => {
    expect(selectCategoriesDomain()).toEqual(initialState)

    const state = {
      categories: categoriesState,
      global: initialAppState,
    }

    expect(selectCategoriesDomain(state)).toEqual(categoriesState)
  })

  test('makeSelectCategories', () => {
    expect(makeSelectCategories.resultFunc(initialState)).toBeNull()

    const categories = makeSelectCategories.resultFunc(categoriesState)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const first = categories.first().toJS()

    const firstWithExtraProps = categoriesFixture.results[0] as ExtendedCategory
    firstWithExtraProps.fk = firstWithExtraProps.id.toString()
    firstWithExtraProps.id = firstWithExtraProps._links.self.public
    firstWithExtraProps.key = firstWithExtraProps._links.self.public
    firstWithExtraProps.parentKey = ''
    firstWithExtraProps.value = firstWithExtraProps.name

    expect(first).toEqual(firstWithExtraProps)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const second = categories.skip(1).first().toJS()

    const secondWithExtraProps = categoriesFixture
      .results[1] as ExtendedCategory
    secondWithExtraProps.fk = secondWithExtraProps.id.toString()
    secondWithExtraProps.id = secondWithExtraProps._links.self.public
    secondWithExtraProps.key = secondWithExtraProps._links.self.public
    secondWithExtraProps.parentKey =
      secondWithExtraProps._links?.['sia:parent']?.public ?? ''
    secondWithExtraProps.value = secondWithExtraProps.name

    expect(second).toEqual(secondWithExtraProps)
  })

  test('makeSelectCategories should only return active categories', () => {
    const total = categoriesFixture.results.length
    const inactive = categoriesFixture.results.filter(
      ({ is_active }) => !is_active
    ).length

    const categories = makeSelectCategories.resultFunc(categoriesState)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = categories.toJS() as Array<ExtendedCategory>

    expect(result.length).toEqual(total - inactive)

    result.forEach((category) => {
      expect(category.is_active).toEqual(true)
    })
  })

  test('makeSelectAllCategories', () => {
    const total = categoriesFixture.results.length
    expect(makeSelectAllCategories.resultFunc(initialState)).toBeNull()

    const result = makeSelectAllCategories.resultFunc(categoriesState)
    const categories = result?.toJS() as Array<ExtendedCategory>

    expect(categories.length).toEqual(total)
  })

  test('makeSelectMainCategories', () => {
    expect(makeSelectMainCategories.resultFunc(null)).toBeNull()

    const mainCategories = makeSelectMainCategories.resultFunc(
      makeSelectCategories.resultFunc(categoriesState)
    )
    const slugs = mainCategories?.map(({ slug }) => slug)
    const keys = categoriesFixture.results
      .filter(filterForMain)
      .map(({ slug }) => slug)

    expect(slugs).toStrictEqual(keys)
  })

  test('makeSelectSubCategories', () => {
    expect(makeSelectSubCategories.resultFunc(null)).toBeNull()

    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(categoriesState)
    )
    const slugs = subCategories?.map(({ slug }) => slug).sort()
    const keys = categoriesFixture.results
      .filter(filterForSub)
      .filter(({ is_active }) => is_active)
      .map(({ slug }) => slug)
      .sort()

    expect(slugs).toEqual(keys)
  })

  test('makeSelectSubCategories extendedName', () => {
    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(categoriesState)
    )

    const subCatWithResponsibleDepts = subCategories?.find(
      ({ departments }) =>
        departments.filter(({ is_responsible }) => is_responsible).length > 0
    )
    const deptCodes = subCatWithResponsibleDepts?.departments
      .filter(({ is_responsible }) => is_responsible)
      .map(({ code }) => code)

    deptCodes?.forEach((code) => {
      expect(
        subCatWithResponsibleDepts?.extendedName.indexOf(code)
      ).toBeGreaterThan(0)
    })
  })

  test('makeSelectAllSubCategories', () => {
    expect(makeSelectAllSubCategories.resultFunc(null)).toBeNull()

    const subCategories = makeSelectAllSubCategories.resultFunc(
      makeSelectAllCategories.resultFunc(categoriesState)
    )
    const slugs = subCategories?.map(({ slug }) => slug).sort()
    const keys = categoriesFixture.results
      .filter(filterForSub)
      .map(({ slug }) => slug)
      .sort()

    expect(slugs).toEqual(keys)
  })

  test('makeSelectByMainCategory', () => {
    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(categoriesState)
    )

    const parentKey = categoriesFixture.results[0]._links.self.public
    const count =
      subCategories?.filter(
        ({ _links }) => _links?.['sia:parent']?.public === parentKey
      ).length || 0

    expect(
      makeSelectByMainCategory.resultFunc(subCategories)(parentKey)
    ).not.toBeNull()

    expect(
      makeSelectByMainCategory.resultFunc(subCategories)(parentKey)
    ).toHaveLength(count)
  })

  test('makeSelectStructuredCategories', () => {
    const mainCategories = makeSelectMainCategories.resultFunc(
      makeSelectCategories.resultFunc(categoriesState)
    )
    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(categoriesState)
    )
    const count = categoriesFixture.results.filter(filterForMain).length
    const structuredCategories = makeSelectStructuredCategories.resultFunc(
      mainCategories,
      makeSelectByMainCategory.resultFunc(subCategories)
    )

    expect(structuredCategories).not.toBeNull()
    expect(Object.keys(structuredCategories || {})).toHaveLength(count)
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
    expect(subcategoryGroups.length).toEqual(mainCategoriesFixture?.length)
    expect(subcategoryOptions.length).toEqual(subCategoriesFixture?.length)

    const subCatOptions = subcategoryOptions as Array<SubCategoryOption>
    subCatOptions.forEach(
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
