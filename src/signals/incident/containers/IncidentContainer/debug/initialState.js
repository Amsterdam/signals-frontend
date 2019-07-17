import afval from './afval'; // eslint-disable-line no-unused-vars
import overlastBedrijven from './overlast-bedrijven-en-horeca'; // eslint-disable-line no-unused-vars
import overlastOpenbareRuimte from './overlast-in-openbare-ruimte'; // eslint-disable-line no-unused-vars
import overlastWater from './overlast-op-het-water'; // eslint-disable-line no-unused-vars
import overlastDieren from './overlast-van-dieren'; // eslint-disable-line no-unused-vars
// import overlastPersonen from './overlast-van-en-door-personen-of-groepen';
import brug from './brug'; // eslint-disable-line no-unused-vars
import gladheid from './gladheid'; // eslint-disable-line no-unused-vars
import klok from './klok'; // eslint-disable-line no-unused-vars
import verkeerslicht from './verkeerslicht'; // eslint-disable-line no-unused-vars
import straatverlichting from './straatverlichting'; // eslint-disable-line no-unused-vars

export default {
  location: {
    address: {
      openbare_ruimte: 'Plantage Middenlaan',
      huisnummer: '48',
      huisletter: '',
      huisnummer_toevoeging: '',
      postcode: '1018DH',
      woonplaats: 'Amsterdam'
    },
    buurt_code: 'A08d',
    stadsdeel: 'A',
    geometrie: {
      type: 'Point',
      coordinates: [
        4.913291931152344,
        52.36582256756977
      ]
    }
  },
  category: 'wegen-verkeer-straatmeubilair',
  subcategory: 'lantaarnpaal-straatverlichting',
  subcategory_link: 'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/lantaarnpaal-straatverlichting',
  description: 'lantaarnpaal-straatverlichting',
  handling_message: 'Het herstellen van problemen met de openbare verlichting lukt doorgaans binnen 5 werkdagen. Bij gevaarlijke situaties wordt de melding meteen opgepakt.',
  phone: '020654321',
  email: 'a@b.com',

  datetime: {
    id: 'Nu',
    label: 'Nu'
  },

  // ...afval,
  // ...overlastBedrijven,
  // ...overlastOpenbareRuimte,
  // ...overlastWater,
  // ...overlastDieren,
  // ...overlastPersonen,

  // wegen-verkeer-straatmeulilair:
  // ...brug,
  // ...gladheid,
  // ...klok,
  // ...verkeerslicht,
  ...straatverlichting
};
