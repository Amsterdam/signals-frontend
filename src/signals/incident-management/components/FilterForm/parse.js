import clonedeep from 'lodash.clonedeep';

/**
 * Parse form data for
 *
 * The data required for filtering incidents should contain values for keys 'main_slug' and 'sub_slug'
 * If the form data contains entries for main_slug, it means that 'Select all' has been toggled. If it contains entries
 * for sub_slug, individual entries have been selected. If an entry for main_slug is found in the form data, all
 * corresponding entries for sub_slug are removed. Individual sub_slug entries are grouped under the key 'sub_slug'.
 *
 * @param   {FormData} formData
 * @returns {Object}
 */
export const parseOutputFormData = (form) => {
  const formData = new FormData(form);
  const parsed = {};

  Array.from(formData.entries()).forEach(([key, value]) => {
    if (Object.keys(parsed).includes(key)) {
      const val = parsed[key];

      parsed[key] = Array.isArray(val) ? [...val, value] : [val, value];
    } else {
      parsed[key] = value;
    }
  });

  // remove any sub_slug entries that are covered by entries in main_slug
  if (Array.isArray(parsed.main_slug)) {
    parsed.main_slug.forEach((main_slug) => {
      delete parsed[`${main_slug}_sub_slug`];
    });
  } else {
    delete parsed[`${parsed.main_slug}_sub_slug`];
  }

  // consolidate sub_slug entries
  Object.keys(parsed).forEach((key) => {
    if (key.endsWith('_sub_slug')) {
      const subSlugs = parsed[key];
      delete parsed[key];

      if (!parsed.sub_slug) {
        parsed.sub_slug = [];
      }

      if (Array.isArray(subSlugs)) {
        parsed.sub_slug = [...parsed.sub_slug, ...subSlugs];
      } else {
        parsed.sub_slug = [...parsed.sub_slug, subSlugs];
      }
    }
  });

  return parsed;
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
  const arrayFields = [
    'main_slug',
    'sub_slug',
    'priority__priority',
    'status__state',
    'location__stadsdeel',
  ];

  const parsed = clonedeep(filterData);

  if (Object.keys(filterData).length) {
    // convert scalar values to arrays
    Object.keys(filterData).forEach((fieldName) => {
      if (
        arrayFields.includes(fieldName) &&
        !Array.isArray(filterData[fieldName])
      ) {
        parsed[fieldName] = [filterData[fieldName]];
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
    if (parsed.main_slug) {
      parsed.main_slug = parsed.main_slug.map((obj) => ({
        ...obj,
        key: obj.slug,
      }));
    }

    if (parsed.sub_slug) {
      parsed.sub_slug = parsed.sub_slug.map((obj) => ({
        ...obj,
        key: obj.slug,
      }));
    }

    debugger;
  }

  return parsed;
};
