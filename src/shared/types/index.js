import PropTypes from 'prop-types';
import { isDate } from 'utils';

const dateTypeFactory = (isRequired) =>
  /**
   * @param  {Object} props - component props
   * @param  {String} propName - component prop name to validate
   * @param  {String} componentName - component name
   * @return {(Error|null)}
   */
  (props, propName, componentName) => {
    const date = props[propName];
    const errorMsg = (msg) =>
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. ${msg}. Validation failed.`;

    if (date === undefined) {
      return isRequired
        ? new Error(
            `The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`${date}\``,
          )
        : null;
    }

    if (!isDate(date)) {
      return new Error(errorMsg(`'${date}' should be of type \`Date\``));
    }

    return null;
  };

const date = dateTypeFactory(false);
date.isRequired = dateTypeFactory(true);

/**
 * Generic data item type
 */
const dataItem = PropTypes.shape({
  key: PropTypes.string.isRequired,
  slug: PropTypes.string,
  value: PropTypes.string.isRequired,
});

/**
 * Filter type validation for the data structure that comes from and goes to the API
 */
export const apiFilter = PropTypes.shape({
  created_at: date,
  id: PropTypes.number,
  name: PropTypes.string,
  options: PropTypes.shape({
    address_text: PropTypes.string,
    category_slug: PropTypes.arrayOf(PropTypes.string),
    feedback: PropTypes.string,
    incident_date: PropTypes.string,
    maincategory_slug: PropTypes.arrayOf(PropTypes.string),
    priority: PropTypes.arrayOf(PropTypes.string),
    stadsdeel: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.arrayOf(PropTypes.string),
  }),
  refresh: PropTypes.bool,
});

/**
 * Filter type validation for filter data structure in the application
 */
export const filter = PropTypes.shape({
  created_at: date,
  id: PropTypes.number,
  name: PropTypes.string,
  options: PropTypes.shape({
    address_text: PropTypes.string,
    category_slug: PropTypes.arrayOf(dataItem),
    feedback: PropTypes.string,
    incident_date: PropTypes.string,
    maincategory_slug: PropTypes.arrayOf(dataItem),
    priority: PropTypes.string,
    stadsdeel: PropTypes.arrayOf(dataItem),
    status: PropTypes.arrayOf(dataItem),
  }),
  refresh: PropTypes.bool,
});

export const incident = PropTypes.shape({
  _display: PropTypes.string,
  _links: PropTypes.shape({
    self: PropTypes.shape({
      href: PropTypes.string.isRequired,
    }),
  }),
  category: PropTypes.shape({
    category_url: PropTypes.string.isRequired,
    departments: PropTypes.string,
    main: PropTypes.string,
    main_slug: PropTypes.string,
    sub: PropTypes.string,
    sub_slug: PropTypes.string,
    text: PropTypes.string,
    created_at: date,
    has_attachmens: PropTypes.bool,
    id: PropTypes.number,
    incident_date_end: date,
    incident_date_start: date,
    location: PropTypes.shape({
      address: PropTypes.shape({
        huisletter: PropTypes.string,
        huisnummer: PropTypes.string,
        huisnummer_toevoeging: PropTypes.string,
        openbare_ruimte: PropTypes.string,
        postcode: PropTypes.string,
        woonplaats: PropTypes.string,
      }),
      address_text: PropTypes.string,
      buurt_code: PropTypes.string,
      id: PropTypes.number,
      stadsdeel: PropTypes.string,
    }),
  }),
  notes: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    created_by: PropTypes.string,
  })),
  priority: PropTypes.shape({
    priority: PropTypes.string,
  }),
  signal_id: PropTypes.string,
  source: PropTypes.string,
  status: PropTypes.shape({
    state: PropTypes.string,
    state_display: PropTypes.string,
  }),
  updated_at: date,
});

/**
 * Generic datalist type
 */
export const dataList = PropTypes.arrayOf(dataItem);

export const categories = PropTypes.shape({
  main: dataList,
  mainToSub: PropTypes.shape({}),
  sub: dataList,
});

export const dataLists = PropTypes.shape({
  priority: dataList,
  stadsdeel: dataList,
  status: dataList,
  feedback: dataList,
});

export const overviewPage = PropTypes.shape({
  incidents: PropTypes.arrayOf(incident),
  filter,
  page: PropTypes.number,
  sort: PropTypes.string,
});
