import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants';

export const overlastPersonenEnGroepen = {
  extra_jongeren_text: {
    meta: {
      ifAllOf: {
        category: 'overlast-van-en-door-personen-of-groepen',
        subcategory: 'jongerenoverlast',
      },
      type: 'caution',
      value:
        'Weet u de naam van de jongere(n)? Gebruik dan het formulier [Melding zorg en woonoverlast](https://www.amsterdam.nl/zorg-ondersteuning/contact/meldpunt-zorg/). Dan komt uw melding direct bij het juiste team terecht.',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_personen_overig: {
    meta: {
      ifAllOf: {
        category: 'overlast-van-en-door-personen-of-groepen',
      },
      label: 'Om hoeveel personen gaat het (ongeveer)?',
      shortLabel: 'Aantal personen',
      pathMerge: 'extra_properties',
      values: {
        '1-3': '1, 2 of 3',
        '4-6': '4, 5 of 6',
        '7_of_meer': '7 of meer',
        onbekend: 'Onbekend',
      },
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_personen_overig_vaker: {
    meta: {
      ifAllOf: {
        category: 'overlast-van-en-door-personen-of-groepen',
      },
      label: 'Gebeurt het vaker?',
      shortLabel: 'Vaker',
      pathMerge: 'extra_properties',
      values: {
        nee: 'Nee',
        ja: 'Ja, het gebeurt vaker:',
      },
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_personen_overig_vaker_momenten: {
    meta: {
      label: 'Wanneer gebeurt het?',
      shortLabel: 'Momenten',
      pathMerge: 'extra_properties',
      ifAllOf: {
        extra_personen_overig_vaker: 'ja',
        category: 'overlast-van-en-door-personen-of-groepen',
      },
    },
    render: FIELD_TYPE_MAP.textarea_input,
  },
};

export default overlastPersonenEnGroepen;
