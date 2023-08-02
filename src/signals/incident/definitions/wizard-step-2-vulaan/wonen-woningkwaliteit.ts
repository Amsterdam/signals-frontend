import { QuestionFieldType } from '../../../../types/question'
import { falsyOrNumber, inPast } from '../../services/custom-validators'

export const woningkwaliteit = {
  woningkwaliteit_dateTime: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      label: 'Wanneer was het?',
    },
    options: {
      validators: [falsyOrNumber, inPast],
    },
    render: QuestionFieldType.DateTimeInput,
  },

  extra_wonen_woonkwaliteit_direct_gevaar: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      label: 'Denkt u dat er direct gevaar is?',
      subtitle:
        'Bijvoorbeeld: u ruikt een sterke gaslucht of er dreigt een schoorsteen of balkon in te storten',
      shortLabel: 'Direct gevaar',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, er is direct gevaar',
        nee: 'Nee',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woonkwaliteit_direct_gevaar_alert: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      ifAllOf: {
        extra_wonen_woonkwaliteit_direct_gevaar: 'ja',
      },
      type: 'alert',
      value: 'Bel 112 en vul dit formulier niet verder in',
    },
    render: QuestionFieldType.PlainText,
  },
  extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: {
    meta: {
      ifAllOf: {
        extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
        ifOneOf: {
          subcategory: 'woningkwaliteit',
          wonen_overig: 'woningkwaliteit',
        },
      },
      label: 'Hebt u de klacht al bij uw verhuurder, eigenaar of VvE gemeld?',
      shortLabel: 'Gemeld bij eigenaar',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja',
        nee: 'Nee',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woonkwaliteit_direct_gevaar_ja: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      ifAllOf: {
        extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
        extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: 'nee',
      },
      type: 'caution',
      value:
        'Meld uw klacht eerst bij de verhuurder, eigenaar of VvE. Krijgt u geen antwoord of wordt de klacht niet verholpen, vul dan dit formulier in.',
    },
    render: QuestionFieldType.PlainText,
  },
  extra_wonen_woonkwaliteit_bewoner: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      ifAllOf: {
        extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
        extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: 'ja',
      },
      label: 'Bent u zelf bewoner van het adres?',
      shortLabel: 'Bewoner',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ik woon op dit adres',
        nee: 'Nee, ik woon niet op dit adres',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woonkwaliteit_namens_bewoner: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      ifAllOf: {
        extra_wonen_woonkwaliteit_bewoner: 'nee',
        extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
      },
      label: 'Doet u de melding namens de bewoner van het adres?',
      shortLabel: 'Namens bewoner',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ik doe de melding namens de bewoner',
        nee: 'Nee',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woonkwaliteit_toestemming_contact: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      ifAllOf: {
        extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: 'ja',
        extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
      },
      label: 'Mogen we contact met u opnemen om een afspraak te maken?',
      subtitle:
        'Om uw klacht goed te kunnen behandelen willen we vaak even komen kijken of met u overleggen',
      shortLabel: 'Toestemming contact opnemen',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, u mag contact met mij opnemen',
        nee: 'Nee, liever geen contact',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woonkwaliteit_toestemming_contact_ja: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      ifAllOf: {
        extra_wonen_woonkwaliteit_toestemming_contact: 'ja',
        extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
      },
      type: 'caution',
      value: 'Let op! Vul uw telefoonnummer in op de volgende pagina.',
    },
    render: QuestionFieldType.PlainText,
  },
  extra_wonen_woonkwaliteit_geen_contact: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      ifAllOf: {
        extra_wonen_woonkwaliteit_toestemming_contact: 'nee',
        extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
      },
      label: 'Waarom hebt u liever geen contact?',
      shortLabel: 'Liever geen contact',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
}
