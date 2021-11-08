// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import clonedeep from 'lodash/cloneDeep'
import isValid from 'date-fns/isValid'
import parse from 'date-fns/parse'
import format from 'date-fns/format'

import dataLists from 'signals/incident-management/definitions'

import type { Definition } from 'signals/incident-management/definitions/types'
import type {
  Options,
  InitFilter,
} from 'signals/incident-management/components/FilterForm/reducer'
import type SubCategory from 'types/api/sub-category'
import type { ExtendedCategory } from 'models/categories/selectors'

type Category = SubCategory | ExtendedCategory

const arrayFields = [
  'area',
  'category_slug',
  'contact_details',
  'directing_department',
  'routing_department',
  'has_changed_children',
  'kind',
  'maincategory_slug',
  'priority',
  'source',
  'stadsdeel',
  'status',
  'type',
]

export const parseDate = (dateString?: Date, timeString?: string) => {
  if (!dateString || !timeString) return null

  const strippedDateString = dateString
    .toString()
    .replace(new RegExp(`T${timeString}$`), '')
  const parsedDate = parse(strippedDateString, 'yyyy-MM-dd', new Date())

  if (isValid(parsedDate)) {
    return `${format(parsedDate, 'yyyy-MM-dd')}T${timeString}`
  }

  return null
}

/**
 * Parse form data for consumption by global store actions
 *
 * The rich objects in the formState are transformed to flattened arrays containing slugs. Date strings are formatted
 * so that the API can read them.
 */
export const parseOutputFormData = (options: Options) =>
  Object.entries(options).reduce((acc, [key, value]) => {
    let entryValue

    switch (key) {
      case 'category_slug':
      case 'maincategory_slug':
        entryValue = (value as Array<Category>).map(
          ({ slug }) => slug
        ) as Array<string>
        break
      case 'area':
      case 'contact_details':
      case 'directing_department':
      case 'routing_department':
      case 'has_changed_children':
      case 'kind':
      case 'priority':
      case 'source':
      case 'stadsdeel':
      case 'status':
      case 'type':
        entryValue = (value as Array<Definition>).map(
          ({ key: itemKey }) => itemKey
        ) as Array<string>
        break
      case 'created_after':
        entryValue = parseDate(options.created_after, '00:00:00') as
          | string
          | null
        break
      case 'created_before':
        entryValue = parseDate(options.created_before, '23:59:59')
        break
      default:
        entryValue = value as string
    }

    // make sure we do not return values that are either an 0-length string or an empty array
    return entryValue && entryValue?.length > 0
      ? { ...acc, [key]: entryValue }
      : acc
  }, {})

/**
 * Formats filter data so that the form can consume it
 *
 * Turns scalar values into arrays where necessary and replaces keys and slugs with objects
 */
export const parseInputFormData = (
  filterData: InitFilter,
  fixtureData: Partial<Record<keyof Options, Array<Definition>>> = {}
) => {
  const options = clonedeep(filterData.options || {})
  const fields = { ...dataLists, ...fixtureData }

  if (Object.keys(options).length) {
    // replace string entries in filter data with objects from dataLists
    Object.keys(options)
      .filter(
        (fieldName) =>
          arrayFields.includes(fieldName) &&
          Array.isArray(options[fieldName as keyof Options])
      )
      .forEach((fieldName) => {
        if (options[fieldName as keyof Options] === undefined) return

        const fieldOptions = (options[fieldName as keyof Options] as Array<any>)
          .map(
            (value: string) =>
              (fields[fieldName as keyof Options] as Array<Definition>)
                ?.length &&
              (fields[fieldName as keyof Options] as Array<Definition>).find(
                ({ key, slug }) => key === value || slug === value
              )
          )
          .filter(Boolean)

        if (fieldOptions) {
          options[fieldName as keyof Options] = fieldOptions
        }
      })
  }

  return { ...filterData, options }
}

/**
 * Reverse formats filter data
 */
export const parseToAPIData = (filterData: InitFilter) => {
  const options = clonedeep(filterData.options || {})

  Object.keys(options)
    .filter(
      (fieldName) =>
        arrayFields.includes(fieldName) &&
        Array.isArray(options[fieldName as keyof Options])
    )
    .forEach((fieldName) => {
      options[fieldName] = (
        options[fieldName as keyof Options] as Array<Record<string, any>>
      ).map(({ slug, key }) => slug || key)
    })

  return { ...filterData, options }
}

const map = (key: string, mapping: Record<string, any>) => mapping[key] || key
const mapObject = (
  original: Record<string, any>,
  mapping: Record<string, any>
) =>
  Object.entries(original).reduce(
    (acc, [key, value]) => ({ ...acc, [map(key, mapping)]: value }),
    {}
  )

const filterParamsMapping = {
  area: 'area_code',
  areaType: 'area_type_code',
  routing_department: 'routing_department_code',
}

export const mapFilterParams = (params: Record<string, any>) =>
  mapObject(params, filterParamsMapping)

const filterParamsUnmapping = Object.entries(filterParamsMapping).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value]: key,
  }),
  {}
)

export const unmapFilterParams = (params: Record<string, any>) =>
  mapObject(params, filterParamsUnmapping)

const orderingsMapping = {
  days_open: '-created_at',
  '-days_open': 'created_at',
}

export const mapOrdering = (ordering: string) => map(ordering, orderingsMapping)
