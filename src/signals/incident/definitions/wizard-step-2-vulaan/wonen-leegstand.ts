import { QuestionFieldType } from '../../../../types/question'
import { falsyOrNumberOrNow, inPast } from '../../services/custom-validators'

export const leegstand = {
  leegstand_dateTime: {
    meta: {
      ifOneOf: {
        subcategory: 'leegstand',
        wonen_overig: 'leegstand',
      },
      label: 'Wanneer was het?',
    },
    options: {
      validators: [falsyOrNumberOrNow, inPast],
    },
    render: QuestionFieldType.DateTimeInput,
  },

  extra_wonen_leegstand_naam_eigenaar: {
    meta: {
      ifOneOf: {
        subcategory: 'leegstand',
        wonen_overig: 'leegstand',
      },
      label: 'Weet u wie de eigenaar is van de woning?',
      shortLabel: 'Naam eigenaar',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_leegstand_periode: {
    meta: {
      ifOneOf: {
        subcategory: 'leegstand',
        wonen_overig: 'leegstand',
      },
      label: 'Hoe lang staat de woning al leeg?',
      shortLabel: 'Periode leegstand',
      pathMerge: 'extra_properties',
      values: {
        langer_dan_zes_maanden: '6 maanden of langer',
        korter_dan_zes_maanden: 'minder dan 6 maanden',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_leegstand_woning_gebruik: {
    meta: {
      ifOneOf: {
        subcategory: 'leegstand',
        wonen_overig: 'leegstand',
      },
      label: 'Wordt de woning af en toe nog gebruikt?',
      shortLabel: 'Woning gebruik',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, soms is er iemand in de woning',
        nee: 'Nee, er is nooit iemand in de woning',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_leegstand_naam_persoon: {
    meta: {
      ifAllOf: {
        extra_wonen_leegstand_woning_gebruik: 'ja',
        ifOneOf: {
          subcategory: 'leegstand',
          wonen_overig: 'leegstand',
        },
      },
      label: 'Wat is de naam van de persoon die soms in de woning is?',
      shortLabel: 'Naam persoon',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_leegstand_activiteit_in_woning: {
    meta: {
      ifAllOf: {
        extra_wonen_leegstand_woning_gebruik: 'ja',
        ifOneOf: {
          subcategory: 'leegstand',
          wonen_overig: 'leegstand',
        },
      },
      label: 'Wat doet deze persoon volgens u in de woning?',
      shortLabel: 'Activiteit in de woning',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_leegstand_iemand_aanwezig: {
    meta: {
      ifAllOf: {
        extra_wonen_leegstand_woning_gebruik: 'ja',
        ifOneOf: {
          subcategory: 'leegstand',
          wonen_overig: 'leegstand',
        },
      },
      label: 'Op welke dag/tijd is deze persoon op het adres?',
      shortLabel: 'Iemand aanwezig',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
}
