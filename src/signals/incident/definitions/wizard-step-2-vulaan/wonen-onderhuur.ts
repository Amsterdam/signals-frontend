import { QuestionFieldType } from '../../../../types/question'
import { falsyOrNumberOrNow, inPast } from '../../services/custom-validators'

export const onderhuur = {
  onderhuur_dateTime: {
    meta: {
      ifOneOf: {
        subcategory: 'onderhuur-en-adreskwaliteit',
        wonen_overig: 'onderhuur',
      },
      label: 'Wanneer was het?',
    },
    options: {
      validators: [falsyOrNumberOrNow, inPast],
    },
    render: QuestionFieldType.DateTimeInput,
  },

  extra_wonen_onderhuur_aantal_personen: {
    meta: {
      ifOneOf: {
        subcategory: 'onderhuur-en-adreskwaliteit',
        wonen_overig: 'onderhuur',
      },
      label: 'Hoeveel personen wonen op dit adres?',
      shortLabel: 'Aantal personen',
      pathMerge: 'extra_properties',
      values: {
        een_persoon: '1 persoon',
        twee_personen: '2 personen',
        drie_personen: '3 personen',
        vier_personen: '4 personen',
        vijf_of_meer_personen: '5 of meer  personen',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_onderhuur_bewoners_familie: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          subcategory: 'onderhuur-en-adreskwaliteit',
          wonen_overig: 'onderhuur',
        },
      },
      ifOneOf: {
        extra_wonen_onderhuur_aantal_personen: [
          'drie_personen',
          'vier_personen',
          'vijf_of_meer_personen',
        ],
      },
      label:
        'Zijn de mensen die op dit adres wonen volgens u familie van elkaar?',
      shortLabel: 'Bewoners familie',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ze zijn familie van elkaar',
        nee: 'Nee, ze zijn geen familie van elkaar',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_onderhuur_naam_bewoners: {
    meta: {
      ifOneOf: {
        subcategory: 'onderhuur-en-adreskwaliteit',
        wonen_overig: 'onderhuur',
      },
      label: 'Wat zijn de namen van de mensen die op dit adres wonen?',
      shortLabel: 'Naam bewoners',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },
  extra_wonen_onderhuur_woon_periode: {
    meta: {
      ifOneOf: {
        subcategory: 'onderhuur-en-adreskwaliteit',
        wonen_overig: 'onderhuur',
      },
      label: 'Hoe lang wonen deze mensen al op dit adres?',
      shortLabel: 'Woon periode',
      pathMerge: 'extra_properties',
      values: {
        langer_dan_zes_maanden: '6 maanden of langer',
        korter_dan_zes_maanden: 'Minder dan 6 maanden',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_onderhuur_iemand_aanwezig: {
    meta: {
      ifOneOf: {
        subcategory: 'onderhuur-en-adreskwaliteit',
        wonen_overig: 'onderhuur',
      },
      label: 'Op welke dag/tijd is er iemand op het adres?',
      shortLabel: 'Iemand aanwezig',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_onderhuur_naam_huurder: {
    meta: {
      ifOneOf: {
        subcategory: 'onderhuur-en-adreskwaliteit',
        wonen_overig: 'onderhuur',
      },
      label: 'Weet u wie de officiële huurder is van de woning?',
      subtitle: 'De persoon die in de woning zou moeten wonen',
      shortLabel: 'Naam huurder',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_onderhuur_huurder_woont: {
    meta: {
      ifOneOf: {
        subcategory: 'onderhuur-en-adreskwaliteit',
        wonen_overig: 'onderhuur',
      },
      label: 'Weet u waar de officiële huurder woont?',
      shortLabel: 'Huurder woont',
      pathMerge: 'extra_properties',
      values: {
        aangegeven_adres: 'Ja, op het aangegeven adres',
        ander_adres: 'Ja, op een ander adres',
        weet_ik_niet: 'Nee, weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_onderhuur_adres_huurder: {
    meta: {
      ifOneOf: {
        subcategory: 'onderhuur-en-adreskwaliteit',
        wonen_overig: 'onderhuur',
      },
      ifAllOf: {
        extra_wonen_onderhuur_huurder_woont: 'ander_adres',
      },
      label: 'Waar woont de officiële huurder?',
      shortLabel: 'Adres huurder',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
}
