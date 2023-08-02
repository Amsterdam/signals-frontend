import configuration from '../../../../shared/services/configuration/configuration'
import { QuestionFieldType } from '../../../../types/question'
import { falsyOrNumber, inPast } from '../../services/custom-validators'

export const vakantieverhuur = {
  vakantieverhuur_dateTime: {
    meta: {
      ifOneOf: {
        subcategory: 'vakantieverhuur',
        wonen_overig: 'vakantieverhuur',
      },
      label: 'Wanneer was het?',
    },
    options: {
      validators: [falsyOrNumber, inPast],
    },
    render: QuestionFieldType.DateTimeInput,
  },
  extra_wonen_vakantieverhuur_toeristen_aanwezig: {
    meta: {
      ifOneOf: {
        subcategory: 'vakantieverhuur',
        wonen_overig: 'vakantieverhuur',
      },
      label: 'Zijn de toeristen nu aanwezig in de woning?',
      shortLabel: 'Toeristen aanwezig',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, er zijn nu toeristen aanwezig',
        nee: 'Nee, er zijn nu geen toeristen aanwezig',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_vakantieverhuur_aantal_mensen: {
    meta: {
      ifOneOf: {
        subcategory: 'vakantieverhuur',
        wonen_overig: 'vakantieverhuur',
      },
      label: 'Hoeveel toeristen zijn er meestal in de woning?',
      shortLabel: 'Aantal personen',
      pathMerge: 'extra_properties',
      values: {
        vier_of_minder: '1-4 personen',
        vijf_of_meer: '5 of meer personen',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_vakantieverhuur_hoe_vaak: {
    meta: {
      ifOneOf: {
        subcategory: 'vakantieverhuur',
        wonen_overig: 'vakantieverhuur',
      },
      label: 'Hebt u vaker toeristen in de woning gezien?',
      shortLabel: 'Hoe vaak',
      pathMerge: 'extra_properties',
      values: {
        maandelijks: 'Ongeveer één keer per maand',
        wekelijks: 'Ongeveer één keer per week',
        dagelijks: 'Bijna dagelijks',
        eerste_keer: 'Nee, het is de eerste keer',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_vakantieverhuur_wanneer: {
    meta: {
      ifOneOf: {
        extra_wonen_vakantieverhuur_hoe_vaak: ['maandelijks', 'wekelijks'],
      },
      label: 'Is dit meestal in het weekend of doordeweeks?',
      shortLabel: 'Wanneer',
      pathMerge: 'extra_properties',
      values: {
        weekend: 'Meestal in het weekend',
        doordeweeks: 'Meestal doordeweeks',
        wisselend: 'Wisselend',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_vakantieverhuur_bewoning: {
    meta: {
      ifOneOf: {
        subcategory: 'vakantieverhuur',
        wonen_overig: 'vakantieverhuur',
      },
      label: 'Woont er iemand op het adres?',
      subtitle: 'De persoon die langdurig de woning bewoont',
      shortLabel: 'Bewoning',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, er woont iemand op het adres',
        nee: 'Nee, er woont niemand op het adres',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_vakantieverhuur_naam_bewoner: {
    meta: {
      ifOneOf: {
        extra_wonen_vakantieverhuur_bewoning: 'ja',
      },
      label: 'Wat is de naam van de persoon die op het adres woont?',
      shortLabel: 'Naam bewoner',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_vakantieverhuur_online_aangeboden: {
    meta: {
      ifOneOf: {
        subcategory: 'vakantieverhuur',
        wonen_overig: 'vakantieverhuur',
      },
      label: 'Weet u of de woning op internet wordt aangeboden voor verhuur?',
      shortLabel: 'Online aangeboden',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ik heb de woning op internet gezien',
        nee: 'Nee, weet ik niet',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_wonen_vakantieverhuur_link_advertentie: {
    meta: {
      ifOneOf: {
        extra_wonen_vakantieverhuur_online_aangeboden: 'ja',
      },
      label: 'Link naar de advertentie van de woning',
      shortLabel: 'Link advertentie',
      pathMerge: 'extra_properties',
      type: 'url',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wonen_vakantieverhuur_footer: {
    meta: {
      ifOneOf: {
        subcategory: 'vakantieverhuur',
        wonen_overig: 'vakantieverhuur',
      },
      type: 'caution',
      value: `Ziet u in de toekomst dat er toeristen in de woning aanwezig zijn, bel dan direct met ${configuration.language.phoneNumber} en vraag naar team Vakantieverhuur.`,
    },
    render: QuestionFieldType.PlainText,
  },
}
