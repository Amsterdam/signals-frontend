import clonedeep from 'lodash.clonedeep';

export const arrayFields = [
  'feedback',
  'stadsdeel',
  'maincategory_slug',
  'priority',
  'status',
  'category_slug',
];

/**
 * Parse form data for consumption by global store actions
 *
 * The data required for filtering incidents should contain values for keys 'maincategory_slug' and 'category_slug'
 * If the form data contains entries for maincategory_slug, it means that 'Select all' has been toggled. If it contains entries
 * for category_slug, individual entries have been selected. If an entry for maincategory_slug is found in the form data, all
 * corresponding entries for category_slug are removed. Individual category_slug entries are grouped under the key 'category_slug'.
 *
 * @param   {HTMLFormElement} - Form element from which the data should be extracted
 * @returns {Object}
 */
export const parseOutputFormData = (form) => {
  const formData = new FormData(form);
  const parsed = {};

  Array.from(formData.entries()).forEach(([key, value]) => {
    if (arrayFields.includes(key)) {
      const val = parsed[key] || [];
      parsed[key] = [...val, value];
    } else {
      parsed[key] = value;
    }
  });

  // remove any category_slug entries that are covered by entries in maincategory_slug
  if (Array.isArray(parsed.maincategory_slug)) {
    parsed.maincategory_slug.forEach((maincategory_slug) => {
      delete parsed[`${maincategory_slug}_category_slug`];
    });
  } else {
    delete parsed[`${parsed.maincategory_slug}_category_slug`];
  }

  // consolidate category_slug entries
  Object.keys(parsed)
    .filter((key) => key.endsWith('_category_slug'))
    .forEach((key) => {
      const subSlugs = parsed[key];
      delete parsed[key];

      if (!parsed.category_slug) {
        parsed.category_slug = [];
      }

      if (Array.isArray(subSlugs)) {
        parsed.category_slug = [...parsed.category_slug, ...subSlugs];
      } else {
        parsed.category_slug = [...parsed.category_slug, subSlugs];
      }
    });

  const { name, ...options } = parsed;

  return { name, options };
};

/**
 * Formats filter data so that the form can consume it
 *
 * Turns scalar values into arrays where necessary and replaces keys and slugs with objects
 *
 * @param   {Object} filterData - Data to be passed on to the form
 * @returns {Object}
 */
export const parseInputFormData = (filterData, dataLists) => {
  const options = filterData.options || {};
  const parsed = clonedeep(options);
  parsed.name = filterData.name;

  /* istanbul ignore else */
  if (Object.keys(parsed).length) {
    // convert scalar values to arrays
    Object.keys(parsed).forEach((fieldName) => {
      if (
        arrayFields.includes(fieldName) &&
        !Array.isArray(options[fieldName])
      ) {
        parsed[fieldName] = [options[fieldName]];
      }
    });

    // replace string entries in filter data with objects from dataLists
    Object.keys(parsed)
      .filter((fieldName) => arrayFields.includes(fieldName))
      .forEach((fieldName) => {
        parsed[fieldName] = parsed[fieldName].map((value) =>
          dataLists[fieldName].find(
            ({ key, slug }) => key === value || slug === value,
          ),
        );
      });

    // make sure all objects in filterData have the correct values for their 'key' prop
    if (parsed.maincategory_slug) {
      parsed.maincategory_slug = parsed.maincategory_slug.map((obj) => ({
        ...obj,
        key: obj.slug,
      }));
    }

    if (parsed.category_slug) {
      parsed.category_slug = parsed.category_slug.map((obj) => ({
        ...obj,
        key: obj.slug,
      }));
    }
  }

  return parsed;
};
