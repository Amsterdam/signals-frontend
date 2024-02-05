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
      ifOneOf: {
        subcategory: [
          'blokkade-van-de-vaarweg',
          'overig-boten',
          'overlast-op-het-water-geluid',
          'scheepvaart-nautisch-toezicht', // Wat is deze?
          'overlast-op-het-water-snel-varen',
          'overlast-op-het-water-gezonken-boot',
        ],
      },
      ignoreVisibility: true,
      label: 'Wanneer was het?',
      canBeNull: true,
      timeSelectorDisabled: true, // TODO: geldt dit ook voor de niet overig-boten cats?
    },
    options: {
      validators: [falsyOrNumberOrNow, inPast],
    },
    render: QuestionFieldType.DateTimeInput,
  },

  extra_boten_frequentie: {
    meta: {
      ifOneOf: {
        subcategory: ['blokkade-van-de-vaarweg', 'overig-boten'],
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
        subcategory: ['blokkade-van-de-vaarweg', 'overig-boten'],
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
        subcategory: ['blokkade-van-de-vaarweg', 'overig-boten'],
      },
      values: {
        plezier: '(Plezier)boot in privé-eigendom',
        rondvaart: 'Rondvaartboot of salonboot van rederij',
        vracht: 'Vrachtschip of binnenvaartschip',
        huur: 'Huurboot',
        overig: 'Overig',
      },
      label: 'Wat voor soort boot is het?',
      shortLabel: 'Soort boot',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_boten_open_gesloten: {
    meta: {
      ifOneOf: {
        subcategory: ['blokkade-van-de-vaarweg', 'overig-boten'],
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
    render: QuestionFieldType.RadioInput,
  },

  // extra_boten_snelheid_typeboot: {
  //   meta: {
  //     label: 'Wat voor type boot is het?',
  //     shortLabel: 'Type boot',
  //     pathMerge: 'extra_properties',
  //     values: {
  //       pleziervaart: 'Pleziervaart',
  //       rondvaartboot_of_salonboot: 'Rondvaartboot of salonboot',
  //       vrachtschip_of_binnenvaartschip: 'Vrachtschip of binnenvaartschip',
  //       overig: 'Overig',
  //     },
  //     ifAllOf: {
  //       subcategory: 'overlast-op-het-water-snel-varen',
  //     },
  //   },
  //   options: { validators: ['required'] },
  //   render: QuestionFieldType.RadioInput,
  // },
  // extra_boten_snelheid_rederij: {
  //   meta: {
  //     label: 'Wat is de naam van de rederij?',
  //     shortLabel: 'Rederij',
  //     pathMerge: 'extra_properties',
  //     ifAllOf: {
  //       subcategory: 'overlast-op-het-water-snel-varen',
  //       extra_boten_snelheid_typeboot: 'rondvaartboot_of_salonboot',
  //     },
  //   },
  //   render: QuestionFieldType.TextInput,
  // },
  // extra_boten_snelheid_naamboot: {
  //   meta: {
  //     label: 'Wat is de naam van de boot?',
  //     shortLabel: 'Naam boot',
  //     pathMerge: 'extra_properties',
  //     ifAllOf: {
  //       subcategory: 'overlast-op-het-water-snel-varen',
  //       ifOneOf: {
  //         extra_boten_snelheid_typeboot: [
  //           'pleziervaart',
  //           'rondvaartboot_of_salonboot',
  //           'vrachtschip_of_binnenvaartschip',
  //           'overig',
  //         ],
  //       },
  //     },
  //   },
  //   render: QuestionFieldType.TextInput,
  // },

  extra_boten_meer: {
    meta: {
      ifOneOf: {
        subcategory: ['blokkade-van-de-vaarweg', 'overig-boten'],
      },
      label: 'Wat weet u nog meer over deze situatie?',
      shortLabel: 'Extra informatie',
      subtitle:
        'Bijvoorbeeld: waar de boot naar toe vaart, naam boot, kleur van de boot, lengte en andere dingen die u opvallen, aantal passagiers',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },

  // extra_boten_snelheid_meer: {
  //   meta: {
  //     label: 'Wat weet u nog meer over deze situatie?',
  //     shortLabel: 'Extra informatie',
  //     subtitle:
  //       'Bijvoorbeeld: de kleur van de boot, aantal passagiers, vaarrichting, Y of Vignet nummer etc.',
  //     pathMerge: 'extra_properties',
  //     ifAllOf: {
  //       subcategory: 'overlast-op-het-water-snel-varen',
  //       ifOneOf: {
  //         extra_boten_snelheid_typeboot: [
  //           'pleziervaart',
  //           'rondvaartboot_of_salonboot',
  //           'vrachtschip_of_binnenvaartschip',
  //           'overig',
  //         ],
  //       },
  //     },
  //   },
  //   render: QuestionFieldType.TextareaInput,
  // },

  // extra_boten_geluid_meer: {
  //   meta: {
  //     label: 'Wat weet u nog meer over deze situatie?',
  //     shortLabel: 'Extra informatie',
  //     subtitle:
  //       'Bijvoorbeeld: waar de boot naar toe vaart, kleur van de boot, aantal passagiers, kenteken, vignet, etc.',
  //     pathMerge: 'extra_properties',
  //     ifAllOf: {
  //       subcategory: 'overlast-op-het-water-geluid',
  //     },
  //   },
  //   render: QuestionFieldType.TextareaInput,
  // },

  // extra_boten_gezonken_meer: {
  //   meta: {
  //     label: 'Wat weet u nog meer over deze situatie?',
  //     shortLabel: 'Extra informatie',
  //     subtitle:
  //       'Bijvoorbeeld: "er lekt olie", "gevaar voor andere boten", etc.',
  //     pathMerge: 'extra_properties',
  //     ifAllOf: {
  //       subcategory: 'overlast-op-het-water-gezonken-boot',
  //     },
  //   },
  //   render: QuestionFieldType.TextareaInput,
  // },
}

export default overlastOpHetWater
