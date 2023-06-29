// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam

import configuration from 'shared/services/configuration/configuration'
import {
  falsyOrNumber,
  inPast,
} from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'

const woningdelen = {
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
        wonen_overig: ['woningdelen', 'crimineleBewoning'],
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
  extra_wonen_woningdelen_bewoners_familie: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          subcategory: 'woningdelen-spookburgers',
          wonen_overig: ['woningdelen', 'crimineleBewoning'],
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
  extra_wonen_woningdelen_samenwonen: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          subcategory: 'woningdelen-spookburgers',
          wonen_overig: ['woningdelen', 'crimineleBewoning'],
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
}

const onderhuur = {
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

const leegstand = {
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

const woningkwaliteit = {
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

const vakantieverhuur = {
  dateTime: {
    meta: {
      ifOneOf: {
        subcategory: 'vakantieverhuur',
        wonen_overig: 'vakantieverhuur',
      },
      label: 'Wanneer was het?',
      ignoreVisibility: true,
      canBeNull: true,
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

const verhuurderschap = {
  extra_wonen_verhuurderschap_onderwerp: {
    meta: {
      ifOneOf: {
        subcategory: 'goed-verhuurderschap',
      },
      label: 'Uw melding gaat over:',
      shortLabel: 'Onderwerp melding',
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
  extra_wonen_verhuurderschap_discriminatie: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'discriminatie',
      },
      label:
        'Op welke grond bent u tijdens het verhuurproces gediscrimineerd?  We bedoelen in dit geval of u een woning niet heeft gekregen omdat u tot een specifieke groep behoort.',
      shortLabel: 'Discriminatie groep',
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
      shortLabel: 'Andere reden',
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
  extra_wonen_verhuurderschap_intimidatie_toelichting: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'intimidatie',
      },
      label: 'Kunt u toelichten wat er gebeurd is?',
      shortLabel: 'Intimidatie',
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
      shortLabel: 'Bewijsstukken intimidatie',
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
      shortLabel: 'Hoogte borg',
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
      shortLabel: 'Termijn borg',
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
      shortLabel: 'Toelichting',
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
  extra_wonen_verhuurderschap_bemiddelingskosten: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'bemiddelingskosten',
      },
      label:
        'Heeft u naast de huur en de borg nog meer moeten betalen aan de bemiddelaar of makelaar?',
      shortLabel: 'Bemiddelingskosten',
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
        'Heeft u bewijsstukken waaruit blijkt u extra heeft betaald aan een bemiddelaar?',
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
  extra_wonen_verhuurderschap_servicekosten_kostenspecificatie: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'servicekosten',
      },
      label:
        'Heeft u bij het ingaan  van de huurovereenkomst een kostenspecificatie van de verhuurder ontvangen?',
      shortLabel: 'Servicekosten kostenspecificatie',
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

  extra_wonen_verhuurderschap_servicekosten_toelichting: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'servicekosten',
      },
      label: 'Denkt u dat de servicekosten te hoog zijn? ',
      shortLabel: 'Servicekosten toelichting',
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

  // Overige
  extra_wonen_verhuurderschap_overige: {
    meta: {
      ifOneOf: {
        extra_wonen_verhuurderschap_onderwerp: 'overige',
      },
      label: 'Licht uw onderwerp toe:',
      shortLabel: 'Overige onderwerpen',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextInput,
  },

  // Afsluitende vragen en opmerkingen
  extra_wonen_verhuurderschap_afsluitende_vragen: {
    meta: {
      ifOneOf: {
        subcategory: 'goed-verhuurderschap',
      },
      label:
        'Wat is de naam en het e-mailadres van  uw eigenaar, verhuurder of bemiddelaar?',
      shortLabel: 'Afsluitende vragen',
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.TextInput,
  },

  // Arbeidsmigrant
  extra_wonen_verhuurderschap_arbeidsmigrant: {
    meta: {
      ifOneOf: {
        subcategory: 'goed-verhuurderschap',
      },
      label:
        'Heeft u bij het ingaan van de huurovereenkomst een kostenspecificatie van de verhuurder ontvangen?',
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
}

const overig = {
  locatie,
  wonen_overig: {
    meta: {
      ifAllOf: {
        subcategory: 'wonen-overig',
      },
      label: 'Uw melding gaat over:',
      values: {
        vakantieverhuur:
          'Illegale toeristische verhuur in een woning of woonboot',
        onderhuur: 'Illegale onderhuur in een woning of woonboot',
        leegstand: 'Een woning of woonboot die opvallend lang leeg staat',
        crimineleBewoning:
          'Criminele bewoning of activiteiten in een woning of woonboot',
        woningdelen:
          'Woningdelen (de woning wordt door verschillende mensen gedeeld)',
        woningkwaliteit:
          'Achterstallig onderhoud of een gebrek aan een woning wordt niet verholpen door de eigenaar/beheerder',
      },
      resetsStateOnChange: true,
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
}

export const controls = {
  ...woningdelen,
  ...onderhuur,
  ...leegstand,
  ...vakantieverhuur,
  ...verhuurderschap,
  ...woningkwaliteit,
}

const wonen = {
  ...overig,
  ...controls,
}

export default wonen
