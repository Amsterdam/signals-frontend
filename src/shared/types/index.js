// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types';
import { isDate } from 'utils';

const dateTypeFactory = isRequired =>
  /**
   * @param  {Object} props - component props
   * @param  {String} propName - component prop name to validate
   * @param  {String} componentName - component name
   * @return {(Error|null)}
   */
  (props, propName, componentName) => {
    // eslint-disable-line implicit-arrow-linebreak
    const date = props[propName];
    const errorMsg = msg => `Invalid prop \`${propName}\` supplied to \`${componentName}\`. ${msg}. Validation failed.`;

    if (date === undefined) {
      return isRequired
        ? new Error(
          `The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`${date}\``
        )
        : null;
    }

    if (!isDate(date)) {
      return new Error(errorMsg(`'${date}' should be of type \`Date\``));
    }

    return null;
  };

export const dateType = dateTypeFactory(false);
dateType.isRequired = dateTypeFactory(true);

const idOrKeyPropRequired = (props, propName, componentName) => {
  const { id, key } = props;

  if (id === undefined && key === undefined) {
    return new Error(
      `Either prop \`key\` or \`id\` is marked as required in \`${componentName}\`, but neither has been set`
    );
  }

  return null;
};

/**
 * Generic data item type
 */
const dataItemType = PropTypes.shape({
  id: idOrKeyPropRequired,
  key: idOrKeyPropRequired,
  slug: PropTypes.string,
  value: PropTypes.string.isRequired,
});

/**
 * Filter type validation for the data structure that comes from and goes to the API
 */
export const apiFilterType = PropTypes.shape({
  created_at: dateType,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  options: PropTypes.shape({
    address_text: PropTypes.string,
    category_slug: PropTypes.arrayOf(PropTypes.string),
    created_after: PropTypes.string,
    created_before: PropTypes.string,
    feedback: PropTypes.string,
    punctuality: PropTypes.string,
    maincategory_slug: PropTypes.arrayOf(PropTypes.string),
    priority: PropTypes.arrayOf(PropTypes.string),
    area: PropTypes.arrayOf(PropTypes.string),
    stadsdeel: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.arrayOf(PropTypes.string),
  }),
  refresh: PropTypes.bool,
});

/**
 * Filter type validation for filter data structure in the application
 */
export const filterType = PropTypes.shape({
  created_at: dateType,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  options: PropTypes.shape({
    address_text: PropTypes.string,
    category_slug: PropTypes.arrayOf(dataItemType),
    created_after: PropTypes.string,
    created_before: PropTypes.string,
    feedback: PropTypes.string,
    punctuality: PropTypes.string,
    maincategory_slug: PropTypes.arrayOf(dataItemType),
    priority: PropTypes.arrayOf(dataItemType),
    area: PropTypes.arrayOf(dataItemType),
    source: PropTypes.arrayOf(dataItemType),
    stadsdeel: PropTypes.arrayOf(dataItemType),
    status: PropTypes.arrayOf(dataItemType),
  }),
  refresh: PropTypes.bool,
});

export const locationType = PropTypes.shape({
  address: PropTypes.shape({
    huisletter: PropTypes.string,
    huisnummer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    huisnummer_toevoeging: PropTypes.string,
    openbare_ruimte: PropTypes.string,
    postcode: PropTypes.string,
    woonplaats: PropTypes.string,
  }),
  address_text: PropTypes.string,
  buurt_code: PropTypes.string,
  id: PropTypes.number,
  bag_validated: PropTypes.bool,
  stadsdeel: PropTypes.string,
  geometrie: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
});

export const incidentType = PropTypes.shape({
  _display: PropTypes.string,
  _links: PropTypes.shape({
    self: PropTypes.shape({
      href: PropTypes.string.isRequired,
    }),
  }),
  category: PropTypes.oneOfType([
    PropTypes.shape({
      category_url: PropTypes.string.isRequired,
      departments: PropTypes.string,
      main: PropTypes.string,
      main_slug: PropTypes.string,
      sub: PropTypes.string,
      sub_slug: PropTypes.string,
      text: PropTypes.string,
      created_at: dateType,
      has_attachmens: PropTypes.bool,
      id: PropTypes.number,
      incident_date_end: dateType,
      incident_date_start: dateType,
      location: locationType,
    }),
    PropTypes.string,
  ]),
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      created_by: PropTypes.string,
    })
  ),
  priority: PropTypes.shape({
    priority: PropTypes.string,
  }),
  signal_id: PropTypes.string,
  source: PropTypes.string,
  status: PropTypes.shape({
    state: PropTypes.string,
    state_display: PropTypes.string,
    send_email: PropTypes.bool,
  }),
  updated_at: dateType,
});

export const childIncidentType = PropTypes.exact({
  _links: PropTypes.exact({
    self: PropTypes.shape({
      href: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  category: PropTypes.exact({
    departments: PropTypes.string.isRequired,
    main: PropTypes.string.isRequired,
    main_slug: PropTypes.string.isRequired,
    sub: PropTypes.string.isRequired,
    sub_slug: PropTypes.string.isRequired,
  }).isRequired,
  id: PropTypes.number.isRequired,
  status: PropTypes.exact({
    state: PropTypes.string.isRequired,
    state_display: PropTypes.string.isRequired,
  }),
  updated_at: PropTypes.string.isRequired,
  can_view_signal: PropTypes.bool.isRequired,
});

export const attachmentsType = PropTypes.arrayOf(
  PropTypes.shape({
    _display: PropTypes.string,
    location: PropTypes.string,
  })
);

export const defaultTextsType = PropTypes.arrayOf(
  PropTypes.shape({
    state: PropTypes.string,
    templates: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.string,
      })
    ),
  })
);

export const extraPropertiesType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    answer: PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.bool,
      }),
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          label: PropTypes.string,
          value: PropTypes.bool,
        })
      ),
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    category_url: PropTypes.string.isRequired,
  })
);

export const historyType = PropTypes.arrayOf(
  PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    when: PropTypes.string.isRequired,
    what: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    description: PropTypes.string,
    who: PropTypes.string.isRequired,
  })
);

/**
 * Generic datalist type
 */
export const dataListType = PropTypes.arrayOf(dataItemType);

export const categoriesType = PropTypes.shape({
  main: dataListType,
  mainToSub: PropTypes.shape({}),
  sub: dataListType,
});

export const dataListsType = PropTypes.shape({
  feedback: dataListType,
  punctuality: dataListType,
  priority: dataListType,
  source: dataListType,
  stadsdeel: dataListType,
  status: dataListType,
  contact_details: dataListType,
});

export const overviewPageType = PropTypes.shape({
  incidents: PropTypes.arrayOf(incidentType),
  filter: filterType,
  page: PropTypes.number,
  sort: PropTypes.string,
});

export const departmentCategory = PropTypes.shape({
  id: PropTypes.number.isRequired,
  is_responsible: PropTypes.bool,
  can_view: PropTypes.bool,
  category: PropTypes.shape({
    _links: PropTypes.shape({
      self: PropTypes.shape({
        href: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    _display: PropTypes.string.isRequired,
    departments: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        is_intern: PropTypes.bool,
      })
    ).isRequired,
    handling_message: PropTypes.string,
    handling: PropTypes.string.isRequired,
    is_active: PropTypes.bool,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
});

export const departmentCategories = PropTypes.arrayOf(departmentCategory);

export const permissionsType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    codename: PropTypes.string.isRequired,
  })
);

export const linksType = PropTypes.shape({
  self: PropTypes.shape({
    href: PropTypes.string.isRequired,
  }).isRequired,
  'sia-attachments': PropTypes.shape({
    href: PropTypes.string.isRequired,
  }),
  'sia-parent': PropTypes.shape({
    href: PropTypes.string.isRequired,
  }),
  'sia-pdf': PropTypes.shape({
    href: PropTypes.string.isRequired,
  }),
  'sia-children': PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
    })
  ),
}).isRequired;

const userRolePermissionType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    codename: PropTypes.string.isRequired,
    _display: PropTypes.string.isRequired,
    _links: linksType,
  })
);

const userRoleType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  _display: PropTypes.string.isRequired,
  _links: linksType,
  permissons: userRolePermissionType,
});

export const userType = PropTypes.shape({
  username: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  is_active: PropTypes.bool,
  roles: PropTypes.arrayOf(userRoleType),
  profile: PropTypes.shape({
    departments: PropTypes.arrayOf(PropTypes.string),
    note: PropTypes.string,
  }),
});

export const subcategoriesType = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
  })
);

export const directingDepartmentsType = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })
);
