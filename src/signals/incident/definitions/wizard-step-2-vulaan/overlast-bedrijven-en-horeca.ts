// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import { inPast } from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

const overlastBedrijvenEnHoreca = {
  locatie,

  dateTime: {
    meta: {
      ifOneOf: {
        subcategory: [
          'geluidsoverlast-installaties',
          'geluidsoverlast-muziek',
          'overig-horecabedrijven',
          'overlast-evenementen',
          'overlast-terrassen',
          'stankoverlast',
        ],
      },
      label: 'Wanneer heeft u de overlast?',
      canBeNull: true,
    },
    options: {
      validators: [inPast, 'required'],
    },
    render: QuestionFieldType.DateTimeInput,
  },

  extra_bedrijven_horeca_frequentie: {
    meta: {
      ifOneOf: {
        subcategory: [
          'geluidsoverlast-installaties',
          'geluidsoverlast-muziek',
          'overig-horecabedrijven',
          'overlast-terrassen',
          'overlast-evenementen',
          'stankoverlast',
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

  extra_bedrijven_horeca_moment: {
    meta: {
      ifAllOf: {
        extra_bedrijven_horeca_frequentie: 'ja',
      },
      label: 'Op welke momenten van de dag hebt u de overlast?',
      shortLabel: 'Overlast momenten',
      pathMerge: 'extra_properties',
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.TextInput,
  },

  extra_bedrijven_horeca_wat: {
    meta: {
      ifOneOf: {
        subcategory: [
          'geluidsoverlast-installaties',
          'geluidsoverlast-muziek',
          'overig-horecabedrijven',
          'overlast-terrassen',
          'stankoverlast',
        ],
      },
      label: 'Uw melding gaat over:',
      shortLabel: 'Soort bedrijf',
      pathMerge: 'extra_properties',
      values: {
        horecabedrijf:
          'Horecabedrijf, zoals een café, restaurant, snackbar of kantine',
        ander_soort_bedrijf:
          'Ander soort bedrijf, zoals een winkel, supermarkt of sportschool',
        evenement_festival_markt:
          'Evenement, zoals een festival, feest of markt',
        iets_anders: 'Iets anders',
      },
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },

  extra_bedrijven_horeca_naam_bedrijf: {
    meta: {
      ifOneOf: {
        extra_bedrijven_horeca_wat: ['horecabedrijf', 'ander_soort_bedrijf'],
      },
      label: 'Wat is de naam van het bedrijf waar de overlast vandaan komt?',
      shortLabel: 'Mogelijke veroorzaker',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },

  extra_bedrijven_horeca_naam_evenemet: {
    meta: {
      ifOneOf: {
        extra_bedrijven_horeca_wat: ['evenement_festival_markt'],
        subcategory: 'overlast-evenementen',
      },
      label: 'Wat is de naam van het evenement waar de overlast vandaan komt?',
      shortLabel: 'Mogelijke veroorzaker',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },

  extra_bedrijven_horeca_wie_of_wat: {
    meta: {
      ifOneOf: {
        extra_bedrijven_horeca_wat: ['iets_anders'],
      },
      label: 'Wie of wat zorgt voor deze overlast?',
      shortLabel: 'Mogelijke veroorzaker',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },

  extra_bedrijven_horeca_adres: {
    meta: {
      ifOneOf: {
        subcategory: [
          'geluidsoverlast-installaties',
          'geluidsoverlast-muziek',
          'overig-horecabedrijven',
          'overlast-evenementen',
          'overlast-terrassen',
          'stankoverlast',
        ],
      },
      label:
        'In welk gebouw of woning heeft u de overlast? Vul alstublieft het adres in.',
      shortLabel: 'Adres overlast',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },

  extra_bedrijven_horeca_muziek_direct_naast: {
    meta: {
      ifAllOf: {
        subcategory: 'geluidsoverlast-muziek',
      },
      ifOneOf: {
        extra_bedrijven_horeca_wat: ['horecabedrijf', 'ander_soort_bedrijf'],
      },
      label:
        'Woont u direct naast, boven of onder het gebouw waar het geluid vandaan komt?',
      shortLabel: 'Aanpandig',
      pathMerge: 'extra_properties',
      values: {
        naast: 'Naast',
        boven: 'Boven',
        onder: 'Onder',
        nee: 'Nee, ik woon er niet direct naast, boven of onder',
      },
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_bedrijven_horeca_muziek_ramen_dicht_onderneming: {
    meta: {
      ifAllOf: {
        subcategory: 'geluidsoverlast-muziek',
      },
      ifOneOf: {
        extra_bedrijven_horeca_wat: ['horecabedrijf'],
      },
      label: 'Staan de ramen of deuren open van het horecabedrijf?',
      shortLabel: 'Ramen/deuren horeca open',
      subtitle:
        'In de vergunning staan hierover afspraken. Zo weten wij of het bedrijf zich aan de afspraken houdt.',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja',
        nee: 'Nee',
        misschien: 'Dat weet ik niet',
      },
    },
    render: QuestionFieldType.RadioInput,
  },

  extra_bedrijven_horeca_muziek_evenement: {
    meta: {
      ifOneOf: {
        subcategory: 'overlast-evenementen',
        ifAllOf: {
          subcategory: ['geluidsoverlast-muziek'],
          extra_bedrijven_horeca_wat: 'evenement_festival_markt',
        },
      },
      label:
        'Heeft u van de organisatie van het evenement een brief gekregen met informatie?',
      shortLabel: 'Geïnformeerd door organisator',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ik heb een brief gekregen van de organisatie',
        nee: 'Nee, ik heb geen brief gekregen van de organisatie',
      },
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },

  extra_bedrijven_horeca_personen: {
    meta: {
      ifAllOf: {
        subcategory: 'overlast-door-bezoekers-niet-op-terras',
      },
      ifOneOf: {
        extra_bedrijven_horeca_wat: [
          'horecabedrijf',
          'ander_soort_bedrijf',
          'evenement_festival_markt',
          'iets_anders',
        ],
      },
      label: 'Wat is de oorzaak van de overlast?',
      shortLabel: 'Oorzaak overlast',
      values: {
        dronken_bezoekers: 'Dronken bezoekers',
        schreeuwende_bezoekers: 'Schreeuwende bezoekers',
        rokende_bezoekers: 'Rokende bezoekers',
        teveel_fietsen: '(Teveel) fietsen',
        wildplassen: 'Wildplassen',
        overgeven: 'Overgeven',
      },
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.CheckboxInput,
  },

  extra_bedrijven_horeca_stank_ramen: {
    meta: {
      ifAllOf: {
        subcategory: 'stankoverlast',
      },
      label:
        'Staan de deuren of ramen open van het gebouw waar de geur vandaan komt?',
      shortLabel: 'Ramen/deuren open',
      subtitle:
        'In de vergunning staan hierover afspraken. Zo weten wij of het bedrijf zich aan de afspraken houdt.',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja',
        nee: 'Nee',
        misschien: 'Dat weet ik niet',
      },
    },
    render: QuestionFieldType.RadioInput,
  },

  /** General (except geluidsoverlast-muziek --> evenementen) */

  extra_bedrijven_horeca_doorsturen_melding: {
    meta: {
      ifOneOf: {
        subcategory: [
          'stankoverlast',
          'overlast-terrassen',
          'geluidsoverlast-installaties',
          'overig-horecabedrijven',
        ],
      },
      label: 'Mogen wij uw melding doorsturen als dat nodig is?',
      subtitle:
        'Soms moet een andere organisatie uw melding oppakken. Dan sturen wij uw melding door.',
      shortLabel: 'Doorsturen melding',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },

  extra_bedrijven_horeca_caution: {
    meta: {
      ifOneOf: {
        subcategory: [
          'stankoverlast',
          'overlast-terrassen',
          'geluidsoverlast-installaties',
          'overig-horecabedrijven',
        ],
      },
      value:
        'Wij willen graag contact met u om meer te weten over wat hier gebeurt. Vul alstublieft uw telefoonnummer en e-mailadres in bij de volgende vraag. Wij geven uw gegevens niet door aan het bedrijf of de organisator.',
      type: 'info',
    },
    render: QuestionFieldType.PlainText,
  },

  /** Exception geluidsoverlast-muziek --> evenementen */

  extra_bedrijven_horeca_doorsturen_melding_geluidsoverlast_muziek: {
    meta: {
      ifAllOf: {
        subcategory: 'geluidsoverlast-muziek',
      },
      ifOneOf: {
        extra_bedrijven_horeca_wat: ['horecabedrijf', 'ander_soort_bedrijf'],
      },
      label: 'Mogen wij uw melding doorsturen als dat nodig is?',
      subtitle:
        'Soms moet een andere organisatie uw melding oppakken. Dan sturen wij uw melding door.',
      shortLabel: 'Doorsturen melding',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
    },
    options: { validators: ['required'] },
    render: QuestionFieldType.RadioInput,
  },

  extra_bedrijven_horeca_caution_geluidsoverlast_muziek: {
    meta: {
      ifAllOf: {
        subcategory: 'geluidsoverlast-muziek',
      },
      ifOneOf: {
        extra_bedrijven_horeca_wat: [
          'horecabedrijf',
          'ander_soort_bedrijf',
          'iets_anders',
        ],
      },
      value:
        'Wij willen graag contact met u om meer te weten over wat hier gebeurt. Vul alstublieft uw telefoonnummer en e-mailadres in bij de volgende vraag. Wij geven uw gegevens niet door aan het bedrijf of de organisator.',
      type: 'info',
    },
    render: QuestionFieldType.PlainText,
  },
}

export default overlastBedrijvenEnHoreca
