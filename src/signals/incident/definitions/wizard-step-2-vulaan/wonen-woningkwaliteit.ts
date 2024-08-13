import { QuestionFieldType } from '../../../../types/question'

export const woningkwaliteit = {
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
}
