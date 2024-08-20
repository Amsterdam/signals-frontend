// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import {
  // falsyOrNumberOrNow,
  inPast,
} from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const overlastPersonenEnGroepen = {
  locatie,
  dateTime: {
    meta: {
      ifOneOf: {
        subcategory: [
          'daklozen-bedelen',
          'drank-en-drugsoverlast',
          'jongerenoverlast',
          'overige-overlast-door-personen',
          'overlast-door-afsteken-vuurwerk',
          'overlast-van-taxis-bussen-en-fietstaxis',
          'wildplassen-poepen-overgeven',
        ],
      },
      label: 'Wanneer is of was de overlast?',
      ignoreVisibility: true,
      canBeNull: false,
    },
    options: {
      validators: ['required', inPast],
    },
    render: QuestionFieldType.DateTimeInput,
  },
  extra_drugs_verkoop: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          subcategory: [
            'drank-en-drugsoverlast',
            'overige-overlast-door-personen',
          ],
        },
      },
      label: 'Denkt u dat er drugs worden verkocht?',
      shortLabel: 'Verkoop drugs',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ik denk dat er drugs worden verkocht',
        nee: 'Nee, ik denk dat er geen drugs worden verkocht',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
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
    render: QuestionFieldType.PlainText,
  },
  extra_personen_overig: {
    meta: {
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
    render: QuestionFieldType.RadioInput,
  },
  extra_personen_overig_vaker_momenten: {
    meta: {
      label: 'Wanneer gebeurt het?',
      shortLabel: 'Momenten',
      pathMerge: 'extra_properties',
      ifAllOf: {
        extra_personen_overig_vaker: 'ja',
      },
    },
    render: QuestionFieldType.TextareaInput,
  },
}

export default overlastPersonenEnGroepen
