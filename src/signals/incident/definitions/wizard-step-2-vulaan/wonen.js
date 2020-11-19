import { Validators } from 'react-reactive-form';

import configuration from 'shared/services/configuration/configuration';
import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

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
    render: FormComponents.TextInput,
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
      validators: [Validators.required],
    },
    render: FormComponents.TextInput,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
        extra_wonen_woningdelen_aantal_personen: ['drie_personen', 'vier_personen', 'vijf_of_meer_personen'],
      },
      label: 'Zijn de bewoners familie van elkaar?',
      shortLabel: 'Bewoners familie',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, de bewoners zijn familie',
        nee: 'Nee, de bewoners zijn geen familie',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
        extra_wonen_woningdelen_aantal_personen: ['drie_personen', 'vier_personen', 'vijf_of_meer_personen'],
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_wonen_woningdelen_wisselende_bewoners: {
    meta: {
      ifOneOf: {
        subcategory: 'woningdelen-spookburgers',
        wonen_overig: ['woningdelen', 'crimineleBewoning'],
      },
      label: 'Komen er vaak andere bewoners op het adres wonen?',
      shortLabel: 'Wisselende bewoners',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, vaak andere bewoners op het adres',
        nee: 'Nee, dezelfde bewoners',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
    render: FormComponents.TextInput,
  },
};

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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
        extra_wonen_onderhuur_aantal_personen: ['drie_personen', 'vier_personen', 'vijf_of_meer_personen'],
      },
      label: 'Zijn de mensen die op dit adres wonen familie van elkaar?',
      shortLabel: 'Bewoners familie',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, ze zijn familie van elkaar',
        nee: 'Nee, ze zijn geen familie van elkaar',
        weet_ik_niet: 'Weet ik niet',
      },
    },
    options: {
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
    render: FormComponents.TextareaInput,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
    render: FormComponents.TextInput,
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
      validators: [Validators.required],
    },
    render: FormComponents.TextInput,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
      label: 'Wat is het adres waar de officiële huurder woont?',
      shortLabel: 'Adres huurder',
      pathMerge: 'extra_properties',
    },
    render: FormComponents.TextInput,
  },
};

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
      validators: [Validators.required],
    },
    render: FormComponents.TextInput,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
    render: FormComponents.TextInput,
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
      label: 'Wat doet deze persoon in de woning?',
      shortLabel: 'Activiteit in de woning',
      pathMerge: 'extra_properties',
    },
    render: FormComponents.TextInput,
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
    render: FormComponents.TextInput,
  },
};

const woningkwaliteit = {
  extra_wonen_woonkwaliteit_direct_gevaar: {
    meta: {
      ifOneOf: {
        subcategory: 'woningkwaliteit',
        wonen_overig: 'woningkwaliteit',
      },
      label: 'Denkt u dat er direct gevaar is?',
      subtitle: 'Bijvoorbeeld: u ruikt een sterke gaslucht of er dreigt een schoorsteen of balkon in te storten',
      shortLabel: 'Direct gevaar',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, er is direct gevaar',
        nee: 'Nee',
      },
    },
    options: {
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
    render: FormComponents.PlainText,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
      value: [
        'Meld uw klacht eerst bij de verhuurder, eigenaar of VvE. Krijgt u geen antwoord of wordt de klacht niet verholpen, vul dan dit formulier in.',
      ],
    },
    render: FormComponents.PlainText,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
      subtitle: 'Om uw klacht goed te kunnen behandelen willen we vaak even komen kijken of met u overleggen',
      shortLabel: 'Toestemming contact opnemen',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, u mag contact met mij opnemen',
        nee: 'Nee, liever geen contact',
      },
    },
    options: {
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
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
      value: ['Let op! Vul uw telefoonnummer in op de volgende pagina.'],
    },
    render: FormComponents.PlainText,
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
      label: 'Waarom heeft u liever geen contact?',
      shortLabel: 'Liever geen contact',
      pathMerge: 'extra_properties',
    },
    render: FormComponents.TextInput,
  },
};

const vakantieverhuur = {
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_wonen_vakantieverhuur_aantal_mensen: {
    meta: {
      ifOneOf: {
        extra_wonen_vakantieverhuur_toeristen_aanwezig: ['ja', 'nee'],
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_wonen_vakantieverhuur_hoe_vaak: {
    meta: {
      ifOneOf: {
        extra_wonen_vakantieverhuur_toeristen_aanwezig: ['ja', 'nee'],
      },
      label: 'Heeft u vaker toeristen in de woning gezien?',
      shortLabel: 'Hoe vaak',
      pathMerge: 'extra_properties',
      values: {
        maandelijks: 'Ongeveer één keer per maand',
        wekelijks: 'Ongeveer één keer per week',
        dagelijks: 'Bijna dagelijks',
        eerste_keer: 'Nee, dit is de eerste keer',
      },
    },
    options: {
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_wonen_vakantieverhuur_wanneer: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          extra_wonen_vakantieverhuur_toeristen_aanwezig: ['ja', 'nee'],
        },
      },
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_wonen_vakantieverhuur_bewoning: {
    meta: {
      ifOneOf: {
        extra_wonen_vakantieverhuur_toeristen_aanwezig: ['ja', 'nee'],
      },
      label: 'Weet u of er iemand op het adres woont?',
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_wonen_vakantieverhuur_naam_bewoner: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          extra_wonen_vakantieverhuur_toeristen_aanwezig: ['ja', 'nee'],
        },
      },
      ifOneOf: {
        extra_wonen_vakantieverhuur_bewoning: 'ja',
      },
      label: 'Wat is de naam van de persoon die op het adres woont?',
      shortLabel: 'Naam bewoner',
      pathMerge: 'extra_properties',
    },
    render: FormComponents.TextInput,
  },
  extra_wonen_vakantieverhuur_online_aangeboden: {
    meta: {
      ifOneOf: {
        extra_wonen_vakantieverhuur_toeristen_aanwezig: ['ja', 'nee'],
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
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_wonen_vakantieverhuur_link_advertentie: {
    meta: {
      ifAllOf: {
        ifOneOf: {
          extra_wonen_vakantieverhuur_toeristen_aanwezig: ['ja', 'nee'],
        },
      },
      ifOneOf: {
        extra_wonen_vakantieverhuur_online_aangeboden: 'ja',
      },
      label: 'Link naar de advertentie van de woning',
      shortLabel: 'Link advertentie',
      pathMerge: 'extra_properties',
      type: 'url',
    },
    render: FormComponents.TextInput,
  },
  extra_wonen_vakantieverhuur_footer: {
    meta: {
      ifOneOf: {
        extra_wonen_vakantieverhuur_toeristen_aanwezig: ['ja', 'nee'],
      },
      type: 'caution',
      value: [
        `Ziet u in de toekomst dat er toeristen in de woning aanwezig zijn, bel dan direct met ${configuration.language.phoneNumber} en vraag naar team Vakantieverhuur.`,
      ],
    },
    render: FormComponents.PlainText,
  },
};

const overig = {
  wonen_overig: {
    meta: {
      ifAllOf: {
        subcategory: 'wonen-overig',
      },
      label: 'Uw melding gaat over:',
      values: {
        vakantieverhuur: 'Illegale toeristische verhuur in een woning of woonboot',
        onderhuur: 'Illegale onderhuur in een woning of woonboot',
        leegstand: 'Een woning of woonboot die opvallend lang leeg staat',
        crimineleBewoning: 'Criminele bewoning of activiteiten in een woning of woonboot',
        woningdelen: 'Woningdelen (de woning wordt door verschillende mensen gedeeld)',
        woningkwaliteit: 'Achterstallig onderhoud of een gebrek aan een woning wordt niet verholpen door de eigenaar/beheerder',
      },
      resetsStateOnChange: true,
    },
    options: {
      validators: [Validators.required],
    },
    render: FormComponents.RadioInputGroup,
  },
};

const intro = {
  custom_text: {
    meta: {
      label: 'Dit hebt u net ingevuld:',
      type: 'citation',
      value: '{incident.description}',
      ignoreVisibility: true,
    },
    render: FormComponents.PlainText,
  },
};

const navigation = {
  $field_0: {
    isStatic: false,
    render: IncidentNavigation,
  },
};

export const controls = {
  ...woningdelen,
  ...onderhuur,
  ...leegstand,
  ...vakantieverhuur,
  ...woningkwaliteit,
};

export default {
  controls: {
    ...intro,
    ...overig,
    ...controls,
    ...navigation,
  },
};
