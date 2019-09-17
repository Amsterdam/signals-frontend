import uuid from 'uuid/v1';
import categories from '../get/categories.json';
import status from '../../../../src/signals/incident-management/definitions/statusList';
import stadsdeel from '../../../../src/signals/incident-management/definitions/stadsdeelList';

const filter = {
  path: '/filters',
  method: 'POST',
  cache: false,
  status: (req, res, next) => {
    res.status(201);
    next();
  },
  template: (params, query, body) => {
    const {
      name = '',
      incident_date_start = '',
      location__address_text,
      status__state = [],
      priority__priority = [],
      main_slug = [],
      sub_slug = [],
      location__stadsdeel = [],
    } = body;

    return {
      id: uuid(),
      name,
      date_start: incident_date_start,
      address: location__address_text,
      status: Array.isArray(status__state) ? status__state.map((statusKey) =>
        status.find(({ key }) => key === statusKey),
      ) : status[status__state],
      priority: priority__priority,
      main: Array.isArray(main_slug) ? main_slug.map((slugKey) =>
        categories.main.find(({ key }) => key === slugKey),
      ) : categories.main[main_slug],
      sub: Array.isArray(sub_slug) ? sub_slug.map((slugKey) =>
        categories.sub.find(({ key }) => key === slugKey),
      ) : categories.main[sub_slug],
      stadsdeel: Array.isArray(location__stadsdeel) ? location__stadsdeel.map((sdKey) =>
        stadsdeel.find(({ key }) => key === sdKey),
      ) : stadsdeel[location__stadsdeel],
    };
  },
};

export default [filter];
