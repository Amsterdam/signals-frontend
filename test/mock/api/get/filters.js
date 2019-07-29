import g from 'dyson-generators';
import uuid from 'uuid/v1';
import categories from './categories.json';
import status from './status.json';
import stadsdeel from './stadsdeel.json';
import priority from './priority.json';
import address from './address.json';
import { pickRandomSublist } from '../../../lib/listRandomizer';

const filter = {
  path: '/me/filter/:id',
  method: 'GET',
  cache: true,
  template: {
    key: () => uuid(),
    name: g.lorem.short,
    date_start: () => {
      const today = new Date();

      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const dates = [
        undefined,
        yesterday,
        today,
        tomorrow,
      ];

      const date = pickRandomSublist(dates)[0];

      if (date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      }

      return undefined;
    },
    address: () => {
      const street = pickRandomSublist(address)[0];
      return `${street} ${g.random(22)}`;
    },
    status: () => pickRandomSublist(status, 4),
    priority: () => pickRandomSublist(priority, 2),
    main: () => pickRandomSublist(categories.main, 3),
    sub: () => pickRandomSublist(categories.sub, 8),
    stadsdeel: () => pickRandomSublist(stadsdeel, 3),
  },
  status: (req, res, next) => {
    if (req.params.foo === '999') {
      res.status(404);
    }
    next();
  },
};

const filters = {
  path: '/me/filters',
  method: 'GET',
  collection: true,
  cache: false,
  size() {
    return Math.floor(Math.random() * 6) + 5;
  },
  template: filter.template,
};

export default { filter, filters };
