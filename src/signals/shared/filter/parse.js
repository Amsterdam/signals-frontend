// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import clonedeep from 'lodash.clonedeep';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

import dataLists from 'signals/incident-management/definitions';

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
];

export const parseDate = (dateString, timeString) => {
  if (!dateString || !timeString) return null;

  const strippedDateString = dateString.replace(new RegExp(`T${timeString}$`), '');
  const parsedDate = parse(strippedDateString, 'yyyy-MM-dd', new Date());
  if (isValid(parsedDate)) return `${format(parsedDate, 'yyyy-MM-dd')}T${timeString}`;

  return null;
};

/**
 * Parse form data for consumption by global store actions
 *
 * The rich objects in the formState are transformed to flattened arrays containing slugs. Date strings are formatted
 * so that the API can read them.
 *
 * @param   {Object} options - Filter options data
 * @returns {Object}
 */
export const parseOutputFormData = options =>
  Object.entries(options).reduce((acc, [key, value]) => {
    let entryValue;

    switch (key) {
      case 'category_slug':
      case 'maincategory_slug':
        entryValue = value.map(({ slug }) => slug);
        break;
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
        entryValue = value.map(({ key: itemKey }) => itemKey);
        break;
      case 'created_after':
        entryValue = parseDate(options.created_after, '00:00:00');
        break;
      case 'created_before':
        entryValue = parseDate(options.created_before, '23:59:59');
        break;
      default:
        entryValue = value;
    }

    // make sure we do not return values that are either an 0-length string or an empty array
    return entryValue && entryValue.length ? { ...acc, [key]: entryValue } : acc;
  }, {});

/**
 * Formats filter data so that the form can consume it
 *
 * Turns scalar values into arrays where necessary and replaces keys and slugs with objects
 *
 * @param   {Object} filterData - Data to be passed on to the form
 * @param   {Object} filterData.options - options key/value object
 * @param   {Object} [fixtureData={}] - collection of fixtures that is used to enrich the filter data with
 * @returns {Object}
 */
export const parseInputFormData = (filterData, fixtureData = {}) => {
  const options = clonedeep(filterData.options || {});
  const fields = { ...dataLists, ...fixtureData };

  if (Object.keys(options).length) {
    // replace string entries in filter data with objects from dataLists
    Object.keys(options)
      .filter(fieldName => arrayFields.includes(fieldName) && Array.isArray(options[fieldName]))
      .forEach(fieldName => {
        options[fieldName] = options[fieldName]
          .map(value => fields[fieldName] && fields[fieldName].find(({ key, slug }) => key === value || slug === value))
          .filter(Boolean);
      });
  }

  return { ...filterData, options };
};

/**
 * Reverse formats filter data
 */
export const parseToAPIData = filterData => {
  const options = clonedeep(filterData.options || {});

  Object.keys(options)
    .filter(fieldName => arrayFields.includes(fieldName) && Array.isArray(options[fieldName]))
    .forEach(fieldName => {
      options[fieldName] = options[fieldName].map(({ slug, key }) => slug || key);
    });

  return { ...filterData, options };
};

const map = (key, mapping) => mapping[key] || key;
const mapObject = (original, mapping) =>
  Object.entries(original).reduce((acc, [key, value]) => ({ ...acc, [map(key, mapping)]: value }), {});

const filterParamsMapping = {
  area: 'area_code',
  areaType: 'area_type_code',
  routing_department: 'routing_department_code',
};
export const mapFilterParams = params => mapObject(params, filterParamsMapping);

const filterParamsUnmapping = Object.entries(filterParamsMapping).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value]: key,
  }),
  {}
);
export const unmapFilterParams = params => mapObject(params, filterParamsUnmapping);

const orderingsMapping = {
  days_open: '-created_at',
  '-days_open': 'created_at',
};
export const mapOrdering = ordering => map(ordering, orderingsMapping);
