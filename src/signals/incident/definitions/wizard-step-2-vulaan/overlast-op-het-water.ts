// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import {
  falsyOrNumberOrNow,
  inPast,
} from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

export const overlastOpHetWater = {
  locatie,
  dateTime: {
    meta: {
      ignoreVisibility: true,
      label: 'Wanneer heeft u de overlast?',
      canBeNull: true,
    },
    options: {
      validators: [falsyOrNumberOrNow, inPast, 'required'],
    },
    render: QuestionFieldType.DateTimeInput,
  },

  extra_boten_frequentie: {
    meta: {
      ifOneOf: {
        subcategory: [
          'blokkade-van-de-vaarweg',
          'overig-boten',
          'overlast-op-het-water-geluid',
          'overlast-op-het-water-gezonken-boot',
          'overlast-op-het-water-snel-varen',
          'overlast-op-het-water-vaargedrag',
        ],
      },
      values: {
        ja: 'Ja, het gebeurt vaker',
        nee: 'Nee, het is de eerste keer',
      },
      label: 'Heeft u deze overlast al eerder gehad?',
      shortLabel: 'Eerder overlast',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_boten_moment: {
    meta: {
      ifAllOf: {
        extra_boten_frequentie: 'ja',
      },
      label: 'Op welke momenten van de dag hebt u de overlast?',
      shortLabel: 'Overlast momenten',
      pathMerge: 'extra_properties',
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.TextInput,
  },

  extra_boten_beweging: {
    meta: {
      ifOneOf: {
        subcategory: [
          'blokkade-van-de-vaarweg',
          'overig-boten',
          'overlast-op-het-water-geluid',
          'overlast-op-het-water-snel-varen',
          'overlast-op-het-water-vaargedrag',
        ],
      },
      values: {
        ja: 'Ja, de boot ligt stil',
        nee: 'Nee, de boot vaart',
      },
      label: 'Ligt de boot stil?',
      shortLabel: 'Beweging boot',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_boten_soort: {
    meta: {
      ifOneOf: {
        subcategory: [
          'overig-boten',
          'overlast-op-het-water-geluid',
          'overlast-op-het-water-snel-varen',
          'overlast-op-het-water-vaargedrag',
        ],
      },
      values: {
        plezier: '(Plezier)boot in privé-eigendom',
        rondvaart: 'Rondvaartboot of salonboot van rederij',
        vracht: 'Vrachtschip of binnenvaartschip',
        huur: 'Huurboot',
        overig: 'Overig',
        weetniet: 'Weet ik niet',
      },
      label: 'Wat voor soort boot is het?',
      shortLabel: 'Soort boot',
      pathMerge: 'extra_properties',
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },

  extra_boten_open_gesloten: {
    meta: {
      ifOneOf: {
        subcategory: [
          'overig-boten',
          'overlast-op-het-water-geluid',
          'overlast-op-het-water-snel-varen',
          'overlast-op-het-water-vaargedrag',
        ],
      },
      values: {
        ja: 'Ja, het is een open boot (bijvoorbeeld een sloep, roeiboot, rondvaartboot met dak open)',
        nee: 'Nee, het is een gesloten boot (bijvoorbeeld een rondvaartboot, salonboot, kajuitboot)',
        onduidelijk: 'Ik kan het niet zien',
      },
      label: 'Is het een open of een gesloten boot?',
      shortLabel: 'Soort boot',
      pathMerge: 'extra_properties',
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },

  extra_boten_drijfkracht: {
    meta: {
      ifOneOf: {
        subcategory: 'overlast-op-het-water-gezonken-boot',
      },
      values: {
        ja: 'Ja, de boot ligt volledig onder water',
        nee: 'Nee, de boot kan nog drijven',
      },
      label: 'Ligt de boot volledig onder water of kan hij nog drijven?',
      shortLabel: 'Drijfkracht',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_boten_vast: {
    meta: {
      ifOneOf: {
        subcategory: 'overlast-op-het-water-gezonken-boot',
      },
      values: {
        ja: 'Ja, de boot ligt vast',
        nee: 'Nee, de boot kan wegdrijven',
      },
      label:
        'Ligt de boot nog vast? Of kan de boot wegdrijven zodat hij de vaarweg blokkeert?',
      shortLabel: 'Boot vast?',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_boten_lekken: {
    meta: {
      ifOneOf: {
        subcategory: 'overlast-op-het-water-gezonken-boot',
      },
      values: {
        ja: 'Ja, boot lekt vloeistof',
        nee: 'Nee, boot lekt geen vloeistof',
        weetniet: 'Weet ik niet',
      },
      label: 'Lekt de boot olie of een andere vloeistof?',
      shortLabel: 'Boot vast?',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_boten_meer: {
    meta: {
      ifOneOf: {
        subcategory: [
          'blokkade-van-de-vaarweg',
          'overig-boten',
          'overlast-op-het-water-geluid',
          'overlast-op-het-water-snel-varen',
          'overlast-op-het-water-vaargedrag',
        ],
      },
      label: 'Wat weet u nog meer over deze situatie?',
      shortLabel: 'Extra informatie',
      subtitle:
        'Bijvoorbeeld: waar de boot naar toe vaart, naam boot, kleur van de boot, lengte en andere dingen die u opvallen, aantal passagiers',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },
}

export default overlastOpHetWater
