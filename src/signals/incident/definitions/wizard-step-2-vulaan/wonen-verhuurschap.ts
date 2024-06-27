import { QuestionFieldType } from '../../../../types/question'

export const verhuurderschap = {
  extra_wonen_verhuurderschap_onderwerp: {
    meta: {
      ifOneOf: {
        subcategory: 'goed-verhuurderschap',
        wonen_overig: 'verhuurderschap',
      },
      label: 'Uw melding gaat over:',
      shortLabel: 'Onderwerp',
      pathMerge: 'extra_properties',
      values: {
        discriminatie: 'Discriminatie',
        intimidatie: 'Intimidatie',
        huurcontract: 'Huurcontract',
        bemiddelingskosten: 'Bemiddelingskosten',
        servicekosten: 'Servicekosten',
        overige: 'Iets anders',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.CheckboxInput,
  },

  extra_wonen_verhuurderschap_onderwerp_overige: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'overige',
      },
      label: 'Namelijk:',
      shortLabel: 'Toelichting overig',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextInput,
  },

  // Discriminatie
  extra_wonen_verhuurderschap_discriminatie_title: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'discriminatie',
      },
      label: 'Discriminatie',
    },

    render: QuestionFieldType.QuestionHeader,
  },

  extra_wonen_verhuurderschap_discriminatie: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'discriminatie',
      },
      label:
        'Op welke grond bent u tijdens het verhuurproces gediscrimineerd?  We bedoelen in dit geval of u een woning niet heeft gekregen omdat u tot een specifieke groep behoort.',
      shortLabel: 'Discriminatie vorm',
      pathMerge: 'extra_properties',
      values: {
        ras: 'Ras',
        geloofsovertuiging: 'Geloofsovertuiging',
        politieke_overtuiging: 'Politieke overtuiging',
        gesalcht: 'Geslacht',
        nationaliteit: 'Nationaliteit',
        seksuele_gerichtheid: 'Seksuele gerichtheid',
        burgelijke_staat: 'Burgerlijke staat',
        handicap: 'Handicap',
        chonische_ziekte: 'Chronische ziekte',
        anders: 'Een andere reden',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.CheckboxInput,
  },

  extra_wonen_verhuurderschap_discriminatie_anders: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_discriminatie: 'anders',
      },
      label: 'Namelijk:',
      shortLabel: 'Andere vorm',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextInput,
  },

  extra_wonen_verhuurderschap_discriminatie_bewijs: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'discriminatie',
      },
      label:
        'Heeft u bewijsstukken waaruit blijkt dat u gediscrimineerd wordt? Bijvoorbeeld een afwijzing van de woning of de selectiecriteria voor het verkrijgen van de woning?',
      shortLabel: 'Bewijs discriminatie',
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

  // Intimidatie
  extra_wonen_verhuurderschap_intimidatie_title: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'intimidatie',
      },
      label: 'Intimidatie',
    },

    render: QuestionFieldType.QuestionHeader,
  },

  extra_wonen_verhuurderschap_intimidatie_toelichting: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'intimidatie',
      },
      label: 'Kunt u toelichten wat er gebeurd is?',
      shortLabel: 'Intimidatie toelichting',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextareaInput,
  },

  extra_wonen_verhuurderschap_intimidatie_bewijs: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'intimidatie',
      },
      label: 'Heeft u bewijsstukken waaruit blijkt dat u geïntimideerd wordt?',
      shortLabel: 'Bewijs intimidatie',
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

  // Huurcontract
  extra_wonen_verhuurderschap_huurcontract_title: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'huurcontract',
      },
      label: 'Huurcontract',
    },

    render: QuestionFieldType.QuestionHeader,
  },

  extra_wonen_verhuurderschap_huurcontract: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'huurcontract',
      },
      label:
        'Heeft u een huurcontract of zijn uw rechten en plichten op een andere manier vastgelegd?',
      shortLabel: 'Huurcontract',
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

  extra_wonen_verhuurderschap_huurcontract_borg_hoogte: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'huurcontract',
      },
      label: 'Is de hoogte van de borg schriftelijk vastgelegd?',
      shortLabel: 'Borg vastelling',
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

  extra_wonen_verhuurderschap_huurcontract_borg_termijn: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'huurcontract',
      },
      label:
        'Is de termijn van vordering van de borg bij beëindiging van de huurovereenkomst schriftelijk vastgelegd?',
      shortLabel: 'Borgtermijn vastelling',
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

  extra_wonen_verhuurderschap_huurcontract_toelichting: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'huurcontract',
      },
      label: 'Wat is er aan de hand met uw huurcontract of uw borg?',
      shortLabel: 'Toelichting huurcontract',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextareaInput,
  },

  extra_wonen_verhuurderschap_huurcontract_bewijs: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'huurcontract',
      },
      label:
        'Heeft u bewijsstukken waaruit blijkt dat uw huurcontract niet klopt?',
      shortLabel: 'Bewijs incorrect huurcontract',
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

  // Dubbele bemiddelingskosten
  extra_wonen_verhuurderschap_bemiddelingskosten_title: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'bemiddelingskosten',
      },
      label: 'Dubbele bemiddelingskosten',
    },

    render: QuestionFieldType.QuestionHeader,
  },

  extra_wonen_verhuurderschap_bemiddelingskosten: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'bemiddelingskosten',
      },
      label:
        'Heeft u naast de huur en de borg nog meer moeten betalen aan de bemiddelaar of makelaar?',
      shortLabel: 'Extra bemiddelingskosten',
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

  extra_wonen_verhuurderschap_bemiddelingskosten_ja: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_bemiddelingskosten: 'ja',
      },
      label: 'Namelijk:',
      shortLabel: 'Toelichting bemiddelingskosten',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextareaInput,
  },

  extra_wonen_verhuurderschap_bemiddelingskosten_bewijs: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'bemiddelingskosten',
      },
      label:
        'Heeft u bewijsstukken waaruit blijkt dat u extra heeft betaald aan een bemiddelaar?',
      shortLabel: 'Bewijs bemiddelingskosten',
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

  // Servicekosten
  extra_wonen_verhuurderschap_servicekosten_title: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'servicekosten',
      },
      label: 'Servicekosten',
    },

    render: QuestionFieldType.QuestionHeader,
  },

  extra_wonen_verhuurderschap_servicekosten_kostenspecificatie: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'servicekosten',
      },
      label:
        'Heeft u bij het ingaan van de huurovereenkomst een kostenspecificatie van de verhuurder ontvangen?',
      shortLabel: 'Servicekostenspecificatie',
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

  extra_wonen_verhuurderschap_servicekosten_jaarlijkse_afrekening: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'servicekosten',
      },
      label:
        'Heeft u van de verhuurder een jaarlijkse afrekening servicekosten ontvangen?',
      shortLabel: 'Servicekosten jaarlijkse afrekening',
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

  extra_wonen_verhuurderschap_servicekosten_hoogte: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'servicekosten',
      },
      label: 'Denkt u dat de servicekosten te hoog zijn? ',
      shortLabel: 'Servicekosten te hoog',
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

  extra_wonen_verhuurderschap_servicekosten_toelichting_ja: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_servicekosten_toelichting: 'ja',
      },
      label: 'Want:',
      shortLabel: 'Toelichting servicekosten',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextareaInput,
  },

  // Afsluitende vragen en opmerkingen
  extra_wonen_verhuurderschap_afsluitende_vragen_title: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: [
          'discriminatie',
          'intimidatie',
          'huurcontract',
          'bemiddelingskosten',
          'servicekosten',
          'overige',
        ],
      },
      label: 'Afsluitende vragen en opmerkingen',
    },

    render: QuestionFieldType.QuestionHeader,
  },

  extra_wonen_verhuurderschap_arbeidsmigrant: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: [
          'discriminatie',
          'intimidatie',
          'huurcontract',
          'bemiddelingskosten',
          'servicekosten',
          'overige',
        ],
      },
      label: 'Bent u een arbeidsmigrant?',
      shortLabel: 'Arbeidsmigrant',
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

  extra_wonen_verhuurderschap_arbeidsmigrant_huurcontract: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_arbeidsmigrant: 'ja',
      },
      label: 'Heeft u een huurcontract?',
      shortLabel: 'Arbeidsmigrant huurcontract',
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

  extra_wonen_verhuurderschap_arbeidsmigrant_huurcontract_taal: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_arbeidsmigrant: 'ja',
      },
      label: 'Is het huurcontract opgesteld in een taal die u begrijpt?',
      shortLabel: 'Arbeidsmigrant huurcontract taal',
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

  extra_wonen_verhuurderschap_arbeidsmigrant_arbeidscontract: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_arbeidsmigrant: 'ja',
      },
      label: 'Heeft u een arbeidscontract?',
      shortLabel: 'Arbeidsmigrant arbeidscontract',
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

  extra_wonen_verhuurderschap_consent: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: [
          'discriminatie',
          'intimidatie',
          'huurcontract',
          'bemiddelingskosten',
          'servicekosten',
          'overige',
        ],
      },
      label:
        'Ik verklaar dat ik akkoord ga met het delen van gegevens met stichting !WOON',
      shortLabel: 'Consent stichting !WOON',
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

  extra_wonen_verhuurderschap_info: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: [
          'discriminatie',
          'intimidatie',
          'huurcontract',
          'bemiddelingskosten',
          'servicekosten',
          'overige',
        ],
      },
      value:
        'Vaak hebben we nog een vraag over uw antwoorden. Dan willen we graag contact met u op kunnen nemen. Bijvoorbeeld om documenten aan te leveren. Wilt u op de volgende pagina uw telefoonnummer en e-mailadres invullen? Dan kunnen we u bereiken.',
      type: 'info',
    },

    render: QuestionFieldType.PlainText,
  },
}
