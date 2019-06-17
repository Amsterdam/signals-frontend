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
  // subcategory: 'klok',
  subcategory_link: 'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/lantaarnpaal-straatverlichting',
  description: 'lantaarnpaal-straatverlichting',
  phone: '020654321',
  email: 'a@b.com',
  datetime: 'Nu',

  extra_straatverlichting: {
    id: 'niet_gevaarlijk',
    label: 'Niet gevaarlijk'
  },
  extra_straatverlichting_nummer: [
    '003182'
  ],
  extra_straatverlichting_probleem: {
    id: 'lamp_is_zichtbaar_beschadigd',
    label: 'Lichtpunt is zichtbaar beschadigd en/of incompleet'
  },
  extra_straatverlichting_hoeveel: {
    id: '1_lichtpunt',
    label: '1 lichtpunt'
  }
};
