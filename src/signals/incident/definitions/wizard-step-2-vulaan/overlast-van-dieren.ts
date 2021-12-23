// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants'

import locatie from './locatie'

const overlastVanDieren = {
  locatie,
  extra_dieren_welk_dier: {
    meta: {
      ifAllOf: {
        category: 'overlast-van-dieren',
        subcategory: 'overig-dieren',
      },
      label: 'Waarover gaat de melding?',
      shortLabel: 'Waarover',
      pathMerge: 'extra_properties',
      values: {
        ratten: 'Rattenoverlast',
        duiven_meeuwen_ganzen: 'Duiven-, meeuwen- of ganzenoverlast',
        wespen: 'Wespenoverlast',
        dode_dieren: 'Dode of zieke dieren',
        anders: 'Andere dieren',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_dieren_waar_wespen: {
    meta: {
      ifOneOf: {
        extra_dieren_welk_dier: 'wespen',
        subcategory: 'wespen',
      },
      label: 'Waar veroorzaken de wespen overlast?',
      shortLabel: 'Waar',
      pathMerge: 'extra_properties',
      values: {
        woning: 'In of bij de woning',
        openbaar: 'In de openbare ruimte, zoals een park of straat',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_dieren_waar_dode_dieren: {
    meta: {
      ifOneOf: {
        extra_dieren_welk_dier: 'dode_dieren',
        subcategory: 'dode-dieren',
      },
      label: 'Om wat voor dode of zieke dieren gaat het?',
      shortLabel: 'Waar',
      pathMerge: 'extra_properties',
      values: {
        woning_tuin: 'Dieren in de woning of tuin',
        water: 'Dieren in het water, zoals vissen of vogels',
        openbaar_huisdieren_vogels:
          'Huisdieren en vogels in de openbare ruimte, zoals een park of straat',
        openbaar_anders:
          'Andere dieren in de openbare ruimte, zoals een park of straat',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },

  extra_dieren_waar_dode_dieren_woning: {
    meta: {
      ifOneOf: {
        extra_dieren_waar_dode_dieren: 'woning_tuin',
      },
      value:
        'De eigenaar, woningcorporatie of VVE van de woning moet het dode of zieke dier laten verwijderen of verzorgen. U hoeft dit formulier niet meer verder in te vullen.',
      type: 'info',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_dieren_waar_dode_dieren_water: {
    meta: {
      ifOneOf: {
        extra_dieren_waar_dode_dieren: 'water',
      },
      value:
        'Dode of zieke dieren in het water kunt u melden bij Waternet, telefoon: [0900 9394](tel:09009394). U hoeft dit formulier niet meer verder in te vullen.',
      type: 'info',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_dieren_waar_dode_dieren_openbaar_huisdieren_vogels: {
    meta: {
      ifOneOf: {
        extra_dieren_waar_dode_dieren: 'openbaar_huisdieren_vogels',
      },
      value:
        'Dode of zieke dieren en vogels in de openbare ruimte kunt u melden bij de Dierenambulance: [020 626 2121](tel:0206262121) (24 uur per dag, 7 dagen per week bereikbaar). U hoeft dit formulier niet meer verder in te vullen.',
      type: 'info',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_dieren_waar_duiven: {
    meta: {
      ifOneOf: {
        subcategory: 'duiven',
      },
      label: 'Waar veroorzaken de duiven overlast?',
      shortLabel: 'Waar',
      pathMerge: 'extra_properties',
      values: {
        woning: 'In of bij de woning',
        openbaar: 'In de openbare ruimte, zoals een park of straat',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_dieren_waar_meeuwen: {
    meta: {
      ifOneOf: {
        subcategory: 'meeuwen',
      },
      label: 'Waar veroorzaken de meeuwen overlast?',
      shortLabel: 'Waar',
      pathMerge: 'extra_properties',
      values: {
        woning: 'In of bij de woning',
        openbaar: 'In de openbare ruimte, zoals een park of straat',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_dieren_waar_ganzen: {
    meta: {
      ifOneOf: {
        subcategory: 'ganzen',
      },
      label: 'Waar veroorzaken de ganzen overlast?',
      shortLabel: 'Waar',
      pathMerge: 'extra_properties',
      values: {
        woning: 'In of bij de woning',
        openbaar: 'In de openbare ruimte, zoals een park of straat',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_dieren_waar_duiven_meeuwen_ganzen: {
    meta: {
      ifOneOf: {
        extra_dieren_welk_dier: 'duiven_meeuwen_ganzen',
      },
      label: 'Waar veroorzaken de duiven, meeuwen of ganzen overlast?',
      shortLabel: 'Waar',
      pathMerge: 'extra_properties',
      values: {
        woning: 'In of bij de woning',
        openbaar: 'In de openbare ruimte, zoals een park of straat',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_dieren_waar_duiven_meeuwen_ganzen_woning: {
    meta: {
      ifOneOf: {
        extra_dieren_waar_duiven_meeuwen_ganzen: 'woning',
        extra_dieren_waar_duiven: 'woning',
        extra_dieren_waar_ganzen: 'woning',
        extra_dieren_waar_meeuwen: 'woning',
      },
      value:
        'De eigenaar, woningcorporatie of VVE van de woning kan u helpen de overlast te verminderen. U vindt adressen van specialisten dierplaagbestrijding op [nvbp.org](https://nvbp.org) of [kad.nl](https://kad.nl). U hoeft dit formulier niet meer verder in te vullen.',
      type: 'info',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_dieren_waar_ratten: {
    meta: {
      ifOneOf: {
        extra_dieren_welk_dier: 'ratten',
        subcategory: ['ratten-in-en-rond-woning', 'ratten'],
      },
      label: 'Waar denkt u dat de ratten zitten?',
      shortLabel: 'Waar',
      pathMerge: 'extra_properties',
      values: {
        woning: 'In de woning',
        tuin: 'In de tuin van de woning of direct naast de woning',
        ander_gebouw:
          'In of bij een ander gebouw, zoals een bedrijf, kantoor of ziekenhuis',
        openbaar: 'In de openbare ruimte, zoals een park of straat',
      },
    },
    options: {
      validators: ['required'],
    },
    render: FIELD_TYPE_MAP.radio_input,
  },
  extra_dieren_waar_ratten_woning: {
    meta: {
      ifOneOf: {
        extra_dieren_waar_ratten: 'woning',
      },
      value:
        'Wij willen u graag bellen over het vervolg. Vul daarom uw telefoonnummer in bij de volgende vraag.',
      type: 'info',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
  extra_dieren_waar_ratten_ander_gebouw: {
    meta: {
      ifOneOf: {
        extra_dieren_waar_ratten: 'ander_gebouw',
      },
      value:
        'Het bedrijf, kantoor of ziekenhuis moet zelf een specialist dierplaagbestrijding inhuren. U vindt adressen van specialisten dierplaagbestrijding op [nvbp.org](https://nvbp.org) of [kad.nl](https://kad.nl). U hoeft dit formulier niet meer verder in te vullen.',
      type: 'info',
    },
    render: FIELD_TYPE_MAP.plain_text,
  },
}

export default overlastVanDieren
