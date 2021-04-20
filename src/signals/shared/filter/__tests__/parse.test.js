// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import priorityList from 'signals/incident-management/definitions/priorityList'
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList'
import categories from 'utils/__tests__/fixtures/categories_private.json'
import { filterForSub, filterForMain } from 'models/categories/selectors'
import dataLists from 'signals/incident-management/definitions'
import category from 'utils/__tests__/fixtures/category.json'

import { subCategories, mainCategories } from 'utils/__tests__/fixtures'
import {
  parseDate,
  parseOutputFormData,
  parseInputFormData,
  parseToAPIData,
  mapFilterParams,
  unmapFilterParams,
  mapOrdering,
} from '../parse'

const filteredSubCategories = categories.results.filter(filterForSub)
const filteredMainCategories = categories.results.filter(filterForMain)

describe('signals/shared/filter/parse', () => {
  describe('parseDate', () => {
    const dateString = '2019-12-10'
    const timeString = '00:00:00'
    const dateWithTimeString = `${dateString}T${timeString}`

    const emptyValues = ['', null, false, undefined]
    const invalidDateStrings = [
      ...emptyValues,
      '2019-12-100',
      'invalid date',
      '1923',
    ]

    it('should parse date without time string', () => {
      expect(parseDate(dateString, timeString)).toEqual(dateWithTimeString)
    })

    it('should parse date with time string', () => {
      expect(parseDate(dateWithTimeString, timeString)).toEqual(
        dateWithTimeString
      )
    })

    it('should return `null` on an invalid date or empty time string', () => {
      invalidDateStrings.forEach((invalidDate) =>
        expect(parseDate(invalidDate, timeString)).toEqual(null)
      )
    })

    it('should return `null` on an empty time string', () => {
      emptyValues.forEach((emptyTimeString) =>
        expect(parseDate(dateString, emptyTimeString)).toEqual(null)
      )
    })
  })

  describe('parseOutputFormData', () => {
    it('should parse output FormData', () => {
      const area = { key: 'area' }
      const maincategory_slug = [...mainCategories, category]
      const category_slug = subCategories.filter(
        ({ slug }) =>
          slug === 'bedrijfsafval' || slug === 'autom-verzinkbare-palen'
      )
      const stadsdeel = stadsdeelList.filter(
        ({ key }) => key === 'A' || key === 'B'
      )
      const formState = {
        unparsed_key: 'Not parsed',
        maincategory_slug,
        category_slug,
        stadsdeel,
        area: [area],
      }

      const expected = {
        unparsed_key: 'Not parsed',
        maincategory_slug: maincategory_slug.map(({ slug }) => slug),
        category_slug: category_slug.map(({ slug }) => slug),
        stadsdeel: stadsdeel.map(({ key }) => key),
        area: [area.key],
      }

      const parsedOutput = parseOutputFormData(formState)
      expect(parsedOutput).toEqual(expected)
    })

    it('should format date values', () => {
      const formState = {
        created_before: '2019-12-19',
        created_after: '2019-12-10',
      }
      const expected = {
        created_before: '2019-12-19T23:59:59',
        created_after: '2019-12-10T00:00:00',
      }

      const parsedOutput = parseOutputFormData(formState)

      expect(parsedOutput).toEqual(expected)
    })

    it('should not format invalid date values', () => {
      const formState = {
        created_before: null,
        created_after: 'this is not a date',
      }
      const expected = {
        created_before: undefined,
        created_after: undefined,
      }

      const parsedOutput = parseOutputFormData(formState)

      expect(parsedOutput).toEqual(expected)
    })

    it('should return non-empty values', () => {
      const formState = {
        priority: [priorityList[0]],
        stadsdeel: [],
      }

      const expected = {
        priority: [priorityList[0].key],
      }

      const parsedOutput = parseOutputFormData(formState)

      expect(parsedOutput).toEqual(expected)
    })
  })

  describe('parseInputFormData', () => {
    const subSlugs = ['bedrijfsafval', 'autom-verzinkbare-palen'].sort()
    const input = {
      name: 'Afval in Westpoort',
      options: {
        stadsdeel: ['B'],
        status: 'status',
        address_text: '',
        maincategory_slug: ['afval'],
        category_slug: subSlugs,
      },
    }

    const maincategory_slug = filteredMainCategories.filter(
      ({ slug }) => slug === 'afval'
    )

    const category_slug = filteredSubCategories.filter(({ slug }) =>
      subSlugs.includes(slug)
    )

    const output = {
      name: 'Afval in Westpoort',
      options: {
        stadsdeel: [
          {
            key: 'B',
            value: 'Westpoort',
          },
        ],
        status: 'status',
        address_text: '',
        maincategory_slug,
        category_slug,
      },
    }

    it('should parse input FormData', () => {
      expect(parseInputFormData(input)).toEqual({
        ...output,
        options: {
          ...output.options,
          maincategory_slug: [],
          category_slug: [],
        },
      })

      expect(
        parseInputFormData(input, { maincategory_slug, category_slug })
      ).toEqual(output)
    })

    it('should return an empty object', () => {
      expect(
        parseInputFormData({}, { maincategory_slug, category_slug })
      ).toEqual({ options: {} })
      expect(parseInputFormData({ options: {} }, dataLists)).toEqual({
        options: {},
      })
    })

    it('should skip slugs that do not have a match in the list of categories', () => {
      // Categories can be made inactive; those are filtered out when the full list is
      // retrieved from the API. However, there can still be stored filters with those
      // inactive categories.
      const inactiveSlug = 'autom-verzinkbare-palen'
      const catSlug = category_slug.filter(({ slug }) => slug !== inactiveSlug)
      const parsedInput = parseInputFormData(input, {
        maincategory_slug,
        category_slug: catSlug,
      })
      const outputSlugs = parsedInput.options.category_slug.map(
        ({ slug }) => slug
      )

      expect(outputSlugs).not.toContain(inactiveSlug)
    })

    describe('parseToAPIData', () => {
      it('should return an object', () => {
        const filterData = { id: 123, name: 'foo' }

        expect(parseToAPIData(filterData)).toEqual({
          options: {},
          id: 123,
          name: 'foo',
        })

        filterData.options = output.options
        expect(parseToAPIData(filterData)).toEqual({
          ...input,
          id: 123,
          name: 'foo',
        })
      })
    })
  })

  describe('mapObject', () => {
    it('should mapFilterParams', () => {
      const data = {
        area: ['123', '456'],
        areaType: 'district',
        routing_department: ['DEP', 'ART'],
        other: 'value',
      }
      const expected = {
        area_code: data.area,
        area_type_code: data.areaType,
        routing_department_code: data.routing_department,
        other: data.other,
      }

      expect(mapFilterParams(data)).toEqual(expected)
    })

    it('should unmapFilterParams', () => {
      const data = {
        area_code: ['123', '456'],
        area_type_code: 'district',
        routing_department_code: ['DEP', 'ART'],
        other: 'value',
      }
      const expected = {
        area: data.area_code,
        areaType: data.area_type_code,
        routing_department: data.routing_department_code,
        other: data.other,
      }

      expect(unmapFilterParams(data)).toEqual(expected)
    })

    it('should mapOrdering', () => {
      expect(mapOrdering('days_open')).toBe('-created_at')
      expect(mapOrdering('-days_open')).toBe('created_at')
      expect(mapOrdering('other')).toBe('other')
    })
  })
})
