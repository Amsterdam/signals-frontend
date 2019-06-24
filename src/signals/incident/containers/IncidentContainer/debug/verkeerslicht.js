export default {
  category: 'wegen-verkeer-straatmeubilair',
  subcategory: 'verkeerslicht',
  description: 'verkeerslicht description',

  extra_verkeerslicht: {
    id: 'verkeerslicht_op_grond_of_scheef',
    label: 'Verkeerslicht ligt op de grond of staat gevaarlijk scheef'
  },
  extra_verkeerslicht_welk: {
    id: 'voetganger',
    label: 'Voetganger'
  },
  extra_verkeerslicht_probleem_voetganger: [
    {
      id: 'blindentikker_werkt_niet',
      label: 'Blindentikker werkt niet'
    }
  ],

  extra_verkeerslicht_probleem_fiets_auto: [
    {
      id: 'rood_werkt_niet',
      label: 'Rood licht werkt niet'
    },
    {
      id: 'groen_duurt_te_lang',
      label: 'Duurt (te) lang voordat het groen wordt'
    }
  ],
  extra_verkeerslicht_probleem_bus_tram: [
    {
      id: 'wit_werkt_niet',
      label: 'Wit licht werkt niet'
    },
    {
      id: 'waarschuwingslicht_tram_werkt_niet',
      label: 'Waarschuwingslicht tram werkt niet'
    }
  ],
  extra_verkeerslicht_rijrichting: 'richting centrum',
  extra_verkeerslicht_nummer: 'nee',
};
