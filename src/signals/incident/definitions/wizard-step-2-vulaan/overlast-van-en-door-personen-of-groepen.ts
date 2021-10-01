// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants'

export const overlastPersonenEnGroepen = {
  extra_drugs_verkoop: {
    meta: {
      ifAllOf: {
        category: 'overlast-van-en-door-personen-of-groepen',
        subcategory: 'drank-en-drugsoverlast',
      },
      label: 'Denkt u dat er drugs worden verkocht?',
      shortLabel: 'Verkopen van drugs',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ik denk dat er drugs worden verkocht',
        nee: 'Nee, ik denk dat er geen drugs worden verkocht',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_drugs_verkoop_ja: {
    meta: {
      ifAllOf: {
        extra_drugs_verkoop: 'ja',
      },
      type: 'info',
      value:
        'De politie behandelt meldingen van verkoop van drugs en overlast van straatdealers. Bel de politie op [0900 8844](tel:09008844). U hoeft dit formulier niet meer verder in te vullen.',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
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
    options: {
      validators: ['required'],
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
        ja: 'Ja, het gebeurt vaker',
      },
    },
    options: {
      validators: ['required'],
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
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.textarea_input,
  },
}

export default overlastPersonenEnGroepen
