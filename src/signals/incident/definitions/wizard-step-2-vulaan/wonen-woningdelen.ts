import { QuestionFieldType } from '../../../../types/question'
import { falsyOrNumberOrNow, inPast } from '../../services/custom-validators'

export const woningdelen = {
  woningdelen_dateTime: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen', 'crimineleBewoning'],
      },
      label: 'Wanneer was het?',
    },
    options: {
      validators: [falsyOrNumberOrNow, inPast],
    },
    render: QuestionFieldType.DateTimeInput,
  },
  extra_wonen_woningdelen_vermoeden: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen', 'crimineleBewoning'],
      },
      label: 'Weet u wat zich in deze woning afspeelt?',
      subtitle: 'Vermoedens over bijvoorbeeld illegale activiteiten',
      shortLabel: 'Vermoeden',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_woningdelen_eigenaar: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen'],
      },
      label: 'Weet u wie de eigenaar is van de woning?',
      shortLabel: 'Weet u wie de eigenaar is?',
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
  extra_wonen_woningdelen_weet_eigenaar: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          subcategory: 'woningdelen-spookburgers',
          wonen_overig: ['woningdelen'],
        },
      },
      ifOneOf: {
        extra_wonen_woningdelen_eigenaar: ['ja'],
      },
      label: 'Weet de eigenaar hoeveel personen in de woning verblijven?',
      shortLabel: 'Weet de eigenaar er vanaf?',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja',
        nee: 'Nee',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woningdelen_hoe_weet_eigenaar: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          subcategory: 'woningdelen-spookburgers',
          wonen_overig: ['woningdelen'],
        },
      },
      ifOneOf: {
        extra_wonen_woningdelen_weet_eigenaar: ['ja'],
      },
      label:
        'Waaruit blijkt dat de eigenaar weet hoeveel personen in de woning verblijven?',
      shortLabel: 'Waaruit blijkt dit?',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextareaInput,
  },
  extra_wonen_criminele_bewoning_eigenaar: {
    meta: {
      ifOneOf: {
        wonen_overig: ['crimineleBewoning'],
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
  extra_wonen_woningdelen_adres_huurder: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen', 'crimineleBewoning'],
      },
      label: 'Weet u waar de officiële huurder woont?',
      subtitle: 'De persoon die in de woning zou moeten wonen',
      shortLabel: 'Adres huurder',
      pathMerge: 'extra_properties',
      values: {
        zelfde_adres: 'Ja, op hetzelfde adres als de bewoners',
        ander_adres: 'Ja, op een ander adres dan de bewoners',
        weet_ik_niet: 'Nee, weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woningdelen_aantal_personen: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen', 'crimineleBewoning'],
      },
      label: 'Hoeveel personen wonen op dit adres?',
      shortLabel: 'Aantal personen',
      pathMerge: 'extra_properties',
      values: {
        een_persoon: '1 persoon',
        twee_personen: '2 personen',
        drie_personen: '3 personen',
        vier_personen: '4 personen',
        vijf_of_meer_personen: '5 of meer personen',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_criminele_bewoning_bewoners_familie: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          wonen_overig: ['crimineleBewoning'],
        },
      },
      ifOneOf: {
        extra_wonen_woningdelen_aantal_personen: [
          'drie_personen',
          'vier_personen',
          'vijf_of_meer_personen',
        ],
      },
      label: 'Zijn de bewoners volgens u familie van elkaar?',
      shortLabel: 'Bewoners familie',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, de bewoners zijn familie',
        nee: 'Nee, de bewoners zijn geen familie',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_criminele_bewoning_samenwonen: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          wonen_overig: ['crimineleBewoning'],
        },
      },
      ifOneOf: {
        extra_wonen_woningdelen_aantal_personen: [
          'drie_personen',
          'vier_personen',
          'vijf_of_meer_personen',
        ],
      },
      label: 'Zijn de personen tegelijk op het adres komen wonen?',
      shortLabel: 'Samenwonen',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ze zijn tegelijk op het adres komen wonen',
        nee: 'Nee, ze zijn op verschillende momenten op het adres komen wonen',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woningdelen_wisselende_bewoners: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen', 'crimineleBewoning'],
      },
      label: 'Komen er vaak nieuwe mensen op het adres wonen?',
      shortLabel: 'Wisselende bewoners',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, vaak andere bewoners op het adres',
        nee: 'Nee, dezelfde bewoners',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_woningdelen_iemand_aanwezig: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen', 'crimineleBewoning'],
      },
      label: 'Op welke dag/tijd is er iemand op het adres?',
      shortLabel: 'Iemand aanwezig',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_woningdelen_overlast: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen'],
      },
      label: 'Ervaart u overlast?',
      shortLabel: 'Ervaart u overlast?',
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
  extra_wonen_woningdelen_overlast_omschrijven: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          subcategory: 'woningdelen-spookburgers',
          wonen_overig: ['woningdelen'],
        },
      },
      ifOneOf: {
        extra_wonen_woningdelen_overlast: ['ja'],
      },
      label: 'Kunt u de overlast die u ervaart omschrijven?',
      subtitle:
        'Waar bestaat de overlast uit, wanneer, hoe vaak en waar vindt het plaats?',
      shortLabel: 'Omschrijving overlast',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextareaInput,
  },
  extra_wonen_woningdelen_overlast_info: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          subcategory: 'woningdelen-spookburgers',
          wonen_overig: ['woningdelen'],
        },
      },
      ifOneOf: {
        extra_wonen_woningdelen_weet_eigenaar: ['ja'],
        extra_wonen_woningdelen_overlast: ['ja'],
      },
      type: 'info',
      value:
        'Heeft u aanvullende bewijsstukken, vul dan alstublieft uw e-mailadres en telefoonnummer in op de volgende pagina. Wij hebben graag contact met u hierover.',
    },
    render: QuestionFieldType.PlainText,
  },
}
