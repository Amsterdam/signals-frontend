import g from 'dyson-generators';
import db from './signals.json';
import { pickRandomElement, pickRandomDate, pickRandomSublist } from '../../../lib/listRandomizer';


const signal = {
  path: '/signal/:id',
  cache: false,
  template: {
    id: g.id,
    user: g.name,
    location: {
      latitude: 52.376,
      logitude: 4.901,
      stadsdeel: () => pickRandomElement(db.stadsdeel)
    },
    current_state: {
      state: 'Gemeld',
      description: 'Verblijfsobject in gebruik'
    },
    department: () => pickRandomElement(db.departement),
    category: () => pickRandomElement(db.hoofdrubriek),
    subcategory: () => pickRandomElement(db.subrubriek),
    incident_date: () => pickRandomDate(new Date(2018, 0, 1), new Date()).toISOString()
  }
};

// const signalsOld = {
//   path: '/auth/signal/?',
//   collection: true,
//   cache: false,
//   size() {
//     return Math.floor(Math.random() * 6) + 5;
//   },
//   template: signal.template
// };

const signals = {
  path: '/auth/signal/?',
  cache: false,
  container: () => {
    const list = pickRandomSublist(db.signals, 5);
    return {
      count: list.length,
      results: list
    };
  }
};

export default { signal, signals };
