import { Validators } from 'react-reactive-form';

import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

export default {
  controls: {
    custom_text: {
      meta: {
        label: 'Dit hebt u net ingevuld:',
        type: 'citation',
        value: '{incident.description}',
        ignoreVisibility: true,
      },
      render: FormComponents.PlainText,
    },



    // woningdelen
    extra_wonen_woningdelen_vermoeden: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
          ],
        },
        label: 'Weet u wat zich in deze woning afspeelt?',
        subtitle: 'Vermoedens over bijvoorbeeld illegale activiteiten',
        shortLabel: 'Vermoeden',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_woningdelen_eigenaar: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
          ],
        },
        label: 'Weet u wie de eigenaar is van de woning?',
        shortLabel: 'Eigenaar',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_woningdelen_adres_huurder: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
          ],
        },
        label: 'Weet u waar de officiële huurder woont?',
        subtitle: 'De persoon die in de woning zou moeten wonen',
        shortLabel: 'Adres huurder',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          zelfde_adres: 'Op het zelfde adres als de bewoners',
          ander_adres: 'Op een ander adres dan de bewoners',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woningdelen_aantal_personen: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
          ],
        },
        label: 'Hoeveel personen wonen er op dit adres?',
        shortLabel: 'Aantal personen',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
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
      render: FormComponents.RadioInput,
    },
    extra_wonen_woningdelen_bewoners_familie: {
      meta: {
        ifAllOf: {
          subcategory: 'woningdelen',
        },
        ifOneOf: {
          extra_wonen_woningdelen_aantal_personen: [
            'drie_personen',
            'vier_personen',
            'vijf_of_meer_personen',
          ],
        },
        label: 'Zijn de bewoners familie van elkaar?',
        shortLabel: 'Bewoners familie',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, de bewoners zijn familie',
          nee: 'Nee, de bewoners zijn geen familie',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woningdelen_samenwonen: {
      meta: {
        ifAllOf: {
          subcategory: 'woningdelen',
        },
        ifOneOf: {
          extra_wonen_woningdelen_aantal_personen: [
            'drie_personen',
            'vier_personen',
            'vijf_of_meer_personen',
          ],
        },
        label: 'Zijn de personen samen op het adres komen wonen?',
        shortLabel: 'Samenwonen',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, ze zijn samen op het adres komen wonen',
          nee: 'Nee, ze zijn op verschillende momenten op het adres komen wonen',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woningdelen_wisselende_bewoners: {
      meta: {
        ifAllOf: {
          subcategory: 'woningdelen',
        },
        label: 'Komen er vaak nieuwe bewoners op het adres wonen?',
        shortLabel: 'Wisselende bewoners',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, vaak wisselende bewoners op het adres',
          nee: 'Nee, dezelfde bewoners',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },





    // onderhuur
    extra_wonen_onderhuur_naam_huurder: {
      meta: {
        ifOneOf: {
          subcategory: [
            'onderhuur',
          ],
        },
        label: 'Weet u wie de officiële huurder is van de woning?',
        subtitle: 'De persoon die in de woning zou moeten wonen',
        shortLabel: 'Naam huurder',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_onderhuur_huurder_woont: {
      meta: {
        ifOneOf: {
          subcategory: [
            'onderhuur',
          ],
        },
        label: 'Weet u waar de officiële huurder woont?',
        shortLabel: 'Huurder woont',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          aangegeven_adres: 'Op het aangegeven adres',
          ander_adres: 'Op een ander adres',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_onderhuur_adres_huurder: {
      meta: {
        ifAllOf: {
          subcategory: 'onderhuur',
        },
        ifOneOf: {
          extra_wonen_onderhuur_huurder_woont: 'ander_adres',
        },
        label: 'Wat is het adres waar de officiële huurder woont?',
        shortLabel: 'Adres huurder',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_onderhuur_aantal_personen: {
      meta: {
        ifOneOf: {
          subcategory: [
            'onderhuur',
          ],
        },
        label: 'Hoeveel personen wonen er op dit adres?',
        shortLabel: 'Aantal personen',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
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
      render: FormComponents.RadioInput,
    },
    extra_wonen_onderhuur_bewoners_familie: {
      meta: {
        ifAllOf: {
          subcategory: 'onderhuur',
        },
        ifOneOf: {
          extra_wonen_onderhuur_aantal_personen: [
            'drie_personen',
            'vier_personen',
            'vijf_of_meer_personen',
          ],
        },
        label: 'Zijn de bewoners familie van elkaar?',
        shortLabel: 'Bewoners familie',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, de bewoners zijn familie',
          nee: 'Nee, de bewoners zijn geen familie',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_onderhuur_naam_bewoners: {
      meta: {
        ifAllOf: {
          subcategory: 'onderhuur',
        },
        label: 'Wat zijn de namen van de mensen die op dit adres wonen?',
        shortLabel: 'Naam bewoners',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, de bewoners zijn familie',
          nee: 'Nee, de bewoners zijn geen familie',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      render: FormComponents.TextareaInput,
    },
    extra_wonen_onderhuur_woon_periode: {
      meta: {
        ifOneOf: {
          subcategory: [
            'onderhuur',
          ],
        },
        label: 'Hoe lang wonen deze mensen al op dit adres?',
        shortLabel: 'Woon periode',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          langer_dan_zes_maanden: '6 maanden of langer',
          korter_dan_zes_maanden: 'minder dan 6 maanden',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },



    // leegstand
    extra_wonen_leegstand_naam_eigenaar: {
      meta: {
        ifOneOf: {
          subcategory: [
            'leegstand',
          ],
        },
        label: 'Weet u wie de eigenaar is van de woning?',
        shortLabel: 'Naam eigenaar',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_leegstand_periode: {
      meta: {
        ifOneOf: {
          subcategory: [
            'leegstand',
          ],
        },
        label: 'Hoe lang staat de woning al (minimaal) leeg?',
        shortLabel: 'Periode leegstand',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          langer_dan_zes_maanden: '6 maanden of langer',
          korter_dan_zes_maanden: 'minder dan 6 maanden',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_leegstand_woning_gebruik: {
      meta: {
        ifOneOf: {
          subcategory: [
            'leegstand',
          ],
        },
        label: 'Wordt de woning af en toe nog gebruikt?',
        shortLabel: 'Woning gebruik',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, soms is er iemand in de woning',
          nee: 'Nee, er is nooit iemand in de woning',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_leegstand_naam_persoon: {
      meta: {
        ifOneOf: {
          subcategory: [
            'leegstand',
          ],
        },
        ifAllOf: {
          extra_wonen_leegstand_woning_gebruik: 'ja',
        },
        label: 'Wat is de naam van de persoon die soms in de woning is?',
        shortLabel: 'Naam persoon',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_leegstand_activiteit_in_woning: {
      meta: {
        ifOneOf: {
          subcategory: [
            'leegstand',
          ],
        },
        ifAllOf: {
          extra_wonen_leegstand_woning_gebruik: 'ja',
        },
        label: 'Wat doet deze persoon in de woning?',
        shortLabel: 'Activiteit in de woning',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_leegstand_iemand_aanwezig: {
      meta: {
        ifOneOf: {
          subcategory: [
            'leegstand',
          ],
        },
        ifAllOf: {
          extra_wonen_leegstand_woning_gebruik: 'ja',
        },
        label: 'Op welke dag/tijd is deze persoon op het adres?',
        shortLabel: 'Iemand aanwezig',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },


    // leegstand en onderhuur
    extra_wonen_iemand_aanwezig: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woningdelen',
            'onderhuur',
          ],
        },
        label: 'Op welke dag/tijd is er iemand op het adres?',
        shortLabel: 'Iemand aanwezig',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },


    // vakantieverhuur
    extra_wonen_vakantieverhuur_toeristen_aanwezig: {
      meta: {
        ifOneOf: {
          subcategory: [
            'vakantieverhuur',
          ],
        },
        label: 'Zijn de toeristen nu aanwezig in de woning?',
        shortLabel: 'Toeristen aanwezig',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, er zijn nu toeristen aanwezig',
          nee: 'Nee, er zijn nu geen toeristen aanwezig',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_vakantieverhuur_bellen_of_formulier: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_toeristen_aanwezig: 'ja',
        },
        label: 'In dit geval kunt u het beste telefonisch contact opnemen dan pakken wij u melding direct op?',
        shortLabel: 'Bellen of meldingsformulier',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          bellen: 'Ik neem telefonisch contact op',
          formulier: 'Ik ga verder met dit meldformulier',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_vakantieverhuur_bellen: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'bellen',
        },
        className: 'col-sm-12 col-md-8',
        type: 'caution',
        value: [
          'Bel nu met 14 020',
          'Vraag naar team Zoeklicht Direct. U wordt direct doorverbonden met een medewerker. Handhaving gaat indien mogelijk, meteen langs.'],
      },
      render: FormComponents.PlainText,
    },
    extra_wonen_vakantieverhuur_aantal_mensen: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'formulier',
        },
        label: 'Hoeveel toeristen zijn er in de woning?',
        shortLabel: 'Aantal personen',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          vier_of_minder: '4 of minder personen',
          vijf_of_meer: '5 of meer personen',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_vakantieverhuur_hoe_vaak: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'formulier',
        },
        label: 'Zijn er vaker toeristen in de woning?',
        shortLabel: 'Hoe vaak',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
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
      render: FormComponents.RadioInput,
    },
    extra_wonen_vakantieverhuur_wanneer: {
      meta: {
        ifOneOf: {
          extra_wonen_vakantieverhuur_hoe_vaak: [
            'maandelijks',
            'wekelijks',
          ],
        },
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'formulier',
        },
        label: 'Is dit meestal in het weekend of doordeweeks?',
        shortLabel: 'Wanneer',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          weekend: 'Meestal in het weekend',
          doordeweeks: 'Meestal doordeweeks',
          wisselend: 'Wisselend',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_vakantieverhuur_bewoning: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'formulier',
        },
        label: 'Weet u of er iemand op het adres woont?',
        subtitle: 'De persoon die langdurig de woning bewoond',
        shortLabel: 'Bewoning',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, er woont iemand op het adres',
          nee: 'Nee, er woont niemand op het adres',
          weet_ik_niet: 'Weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_vakantieverhuur_naam_bewoner: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'formulier',
          extra_wonen_vakantieverhuur_bewoning: 'ja',
        },
        label: 'Wat is de naam van de persoon die op het adres woont?',
        shortLabel: 'Naam bewoner',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_vakantieverhuur_online_aangeboden: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'formulier',
        },
        label: 'Weet u of de woning op internet wordt aangeboden voor verhuur?',
        shortLabel: 'Online aangeboden',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, ik heb de woning op internet gezien',
          nee: 'Nee, weet ik niet',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_vakantieverhuur_link_advertentie: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'formulier',
          extra_wonen_vakantieverhuur_online_aangeboden: 'ja',
        },
        label: 'Link naar de advertentie van de woning?',
        shortLabel: 'Link advertentie',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },
    extra_wonen_vakantieverhuur_footer: {
      meta: {
        ifAllOf: {
          subcategory: [
            'vakantieverhuur',
          ],
          extra_wonen_vakantieverhuur_bellen_of_formulier: 'formulier',
        },
        className: 'col-sm-12 col-md-8',
        type: 'caution',
        value: ['Mocht u in de toekomst zien dat er toeristen in de woning aanwezig zijn a.u.b. direct bellen met 14 020 en vragen naar team Zoeklicht Direct.'],
      },
      render: FormComponents.PlainText,
    },



    // woonkwaliteit
    extra_wonen_woonkwaliteit_direct_gevaar: {
      meta: {
        ifOneOf: {
          subcategory: [
            'woonkwaliteit',
          ],
        },
        label: 'Vermoedt u dat er direct gevaar is?',
        subtitle: 'Bijvoorbeeld: u ruikt een sterke gaslucht of er dreigt een schoorsteen of balkon in te storten',
        shortLabel: 'Direct gevaar',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, er is direct gevaar',
          nee: 'Nee',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woonkwaliteit_direct_gevaar_alert: {
      meta: {
        ifAllOf: {
          subcategory: [
            'woonkwaliteit',
          ],
          extra_wonen_woonkwaliteit_direct_gevaar: 'ja',
        },
        className: 'col-sm-12 col-md-8',
        type: 'alert',
        value: ['Bel 112 en vul dit formulier niet verder in'],
      },
      render: FormComponents.PlainText,
    },
    extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: {
      meta: {
        ifAllOf: {
          subcategory: [
            'woonkwaliteit',
          ],
          extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
        },
        label: 'Hebt u de klacht al bij uw verhuurder, eigenaar of VvE gemeld?',
        shortLabel: 'Gemeld bij eigenaar',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja',
          nee: 'Nee',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woonkwaliteit_direct_gevaar_ja: {
      meta: {
        ifAllOf: {
          subcategory: [
            'woonkwaliteit',
          ],
          extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
          extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: 'nee',
        },
        className: 'col-sm-12 col-md-8',
        type: 'caution',
        value: ['Meldt uw klacht eerst bij de verhuurder, eigenaar of VvE. Krijgt u geen respons of wordt de klacht niet verholpen, vul dan dit formulier in'],
      },
      render: FormComponents.PlainText,
    },
    extra_wonen_woonkwaliteit_bewoner: {
      meta: {
        ifAllOf: {
          subcategory: [
            'woonkwaliteit',
          ],
          extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
          extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: 'ja',
        },
        label: 'Bent u zelf bewoner van het adres?',
        shortLabel: 'Bewoner',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, ik woon op dit adres',
          nee: 'Nee, ik woon niet op dit adres',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woonkwaliteit_namens_bewoner: {
      meta: {
        ifAllOf: {
          subcategory: [
            'woonkwaliteit',
          ],
          extra_wonen_woonkwaliteit_bewoner: 'nee',
          extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
        },
        label: 'Doet u de melding namens de bewoner van het adres?',
        shortLabel: 'Namens bewoner',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, ik doe de melding namens de bewoner',
          nee: 'Nee',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woonkwaliteit_toestemming_contact: {
      meta: {
        ifAllOf: {
          subcategory: [
            'woonkwaliteit',
          ],
          extra_wonen_woonkwaliteit_gemeld_bij_eigenaar: 'ja',
          extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
        },
        label: 'Mogen we contact met u opnemen om een afspraak te maken?',
        shortLabel: 'Toestemming contact opnemen',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
        values: {
          ja: 'Ja, u mag contact met mij opnemen',
          nee: 'Nee, liever geen contact',
        },
      },
      options: {
        validators: [Validators.required],
      },
      render: FormComponents.RadioInput,
    },
    extra_wonen_woonkwaliteit_toestemming_contact_ja: {
      meta: {
        ifAllOf: {
          subcategory: [
            'woonkwaliteit',
          ],
          extra_wonen_woonkwaliteit_toestemming_contact: 'ja',
          extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
        },
        className: 'col-sm-12 col-md-8',
        type: 'caution',
        value: ['Let op! Vul uw telefoonnummer in op de volgende pagina.'],
      },
      render: FormComponents.PlainText,
    },
    extra_wonen_woonkwaliteit_geen_contact: {
      meta: {
        ifAllOf: {
          subcategory: [
            'woonkwaliteit',
          ],
          extra_wonen_woonkwaliteit_toestemming_contact: 'nee',
          extra_wonen_woonkwaliteit_direct_gevaar: 'nee',
        },
        label: 'Waarom heeft u liever geen contact?',
        shortLabel: 'Liever geen contact',
        pathMerge: 'extra_properties',
        className: 'col-sm-12 col-md-8',
      },
      render: FormComponents.TextInput,
    },


    // navigation
    $field_0: {
      isStatic: false,
      render: IncidentNavigation,
    },
  },
};
