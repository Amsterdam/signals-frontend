//  import { pickRandomSublist } from '../../../lib/listRandomizer';
import uuid from 'uuid/v1';
import categories from '../get/categories.json';
import status from '../get/status.json';
import stadsdeel from '../get/stadsdeel.json';

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
      status: status__state.map((statusKey) =>
        status.find(({ key }) => key === statusKey),
      ),
      priority: priority__priority,
      main: main_slug.map((slugKey) =>
        categories.main.find(({ key }) => key === slugKey),
      ),
      sub: sub_slug.map((slugKey) =>
        categories.sub.find(({ key }) => key === slugKey),
      ),
      stadsdeel: location__stadsdeel.map((sdKey) =>
        stadsdeel.find(({ key }) => key === sdKey),
      ),
    };
  },
};

export default [filter];
