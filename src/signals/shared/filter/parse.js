import clonedeep from 'lodash.clonedeep';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

import dataLists from 'signals/incident-management/definitions';

const arrayFields = [
  'stadsdeel',
  'maincategory_slug',
  'status',
  'category_slug',
  'source',
  'priority',
  'contact_details',
  'type',
];

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

      case 'contact_details':
      case 'priority':
      case 'source':
      case 'stadsdeel':
      case 'status':
      case 'type':
        entryValue = value.map(({ key: itemKey }) => itemKey);
        break;

      case 'created_after':
        if (isValid(parse(options.created_after, 'yyyy-MM-dd', new Date()))) {
          entryValue = `${format(parse(options.created_after, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')}T00:00:00`;
        }
        break;

      case 'created_before':
        if (isValid(parse(options.created_before, 'yyyy-MM-dd', new Date()))) {
          entryValue = `${format(parse(options.created_before, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')}T23:59:59`;
        }
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
      .filter(fieldName => arrayFields.includes(fieldName))
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
    .filter(fieldName => arrayFields.includes(fieldName))
    .forEach(fieldName => {
      options[fieldName] = options[fieldName].map(({ slug, key }) => slug || key);
    });

  return { ...filterData, options };
};
