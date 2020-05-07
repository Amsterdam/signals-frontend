import React from 'react';

import { Validators } from 'react-reactive-form';

import configuration from 'shared/services/configuration/configuration';
import DefinitionComponents from '../components';
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

    extra_brug: {
      meta: {
        ifAllOf: {
          subcategory:
            'brug',
        },
        label: 'Hebt u een naam of nummer van de brug?',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    extra_onderhoud_stoep_straat_en_fietspad: {
      meta: {
        ifOneOf: {
          subcategory: [
            'onderhoud-stoep-straat-en-fietspad',
            'gladheid',
          ],
        },
        label: 'Hebt u verteld om wat voor soort wegdek het gaat?',
        subtitle: 'Bijvoorbeeld: asfalt, klinkers of stoeptegels',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextInput,
    },
    extra_wegen_gladheid: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'gladheid',
        },
        type: 'caution',
        value: [
          'Let op:',
          'Is het glad bij een trein-, bus- of metrostation? Neem dan contact op met de NS of GVB:',
          <DefinitionComponents.Anchor href="http://gvb.nl/klantenservice" target="_blank" className="more-link">gvb.nl/klantenservice</DefinitionComponents.Anchor>,
        ],
        pathMerge: 'extra_properties',
      },
      render: FormComponents.PlainText,
    },

    extra_straatverlichting: {
      meta: {
        label: 'Is de situatie gevaarlijk?',
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting',
        },
        values: {
          is_gevolg_van_aanrijding: 'Het is het gevolg van een aanrijding',
          lamp_op_grond_of_scheef: 'Lamp ligt op de grond of staat gevaarlijk scheef',
          deurtje_weg_of_open: 'Deurtje in de mast is niet aanwezig of staat open',
          losse_kabels_zichtbaar_of_lamp_los: 'Er zijn losse electriciteitskabels zichtbaar of er hangt een lamp los',
          niet_gevaarlijk: 'Niet gevaarlijk',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.RadioInput,
    },
    extra_straatverlichting_gevaar: {
      meta: {
        className: 'col-sm-12 col-md-8',
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting',
        },
        ifOneOf: {
          extra_straatverlichting: [
            'is_gevolg_van_aanrijding',
            'lamp_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los',
          ],
        },
        type: 'alert',
        value: [
          'Bel direct 14 020. U hoeft dit formulier niet meer verder in te vullen.',
        ],
      },
      render: FormComponents.PlainText,
    },
    extra_straatverlichting_hoeveel: {
      meta: {
        label: 'Om hoeveel lichtpunten gaat het?',
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting',
        },
        ifOneOf: {
          extra_straatverlichting: [
            'is_gevolg_van_aanrijding',
            'lamp_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los',
            'niet_gevaarlijk',
          ],
        },
        values: {
          '1_lichtpunt': '1 lichtpunt',
          meerdere_lichtpunten: 'Een aantal lichtpunten die bij elkaar staan/hangen',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.RadioInput,
    },
    extra_straatverlichting_probleem: {
      meta: {
        label: 'Wat is het probleem?',
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting',
        },
        ifOneOf: {
          extra_straatverlichting_hoeveel: [
            '1_lichtpunt',
            'meerdere_lichtpunten',
          ],
        },
        values: {
          lamp_doet_het_niet: 'Lamp doet het niet',
          lamp_brandt_overdag: 'Lamp brandt overdag',
          geeft_lichthinder: 'Geeft lichthinder (schijnt bijvoorbeeld in de slaapkamer)',
          lamp_is_vervuild: 'Lichtpunt is vervuild of heeft aanslag',
          lamp_is_zichtbaar_beschadigd: 'Lichtpunt is zichtbaar beschadigd en/of incompleet',
          overig: 'Overig',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.RadioInput,
    },
    extra_straatverlichting_nummer: {
      meta: {
        label: 'Selecteer het lichtpunt waar het om gaat',
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting',
        },
        ifOneOf: {
          extra_straatverlichting_probleem: [
            'lamp_doet_het_niet',
            'lamp_brandt_overdag',
            'geeft_lichthinder',
            'lamp_is_vervuild',
            'lamp_is_zichtbaar_beschadigd',
            'overig',
          ],
        },
        endpoint: configuration.OVL_VERLICHTING_LAYER,
        zoomMin: 18,
        legend_items: [
          'lichtmast',
          'grachtmast',
          'overspanning',
          'gevel_armatuur',
          'schijnwerper',
          'overig_lichtpunt',
        ],
        pathMerge: 'extra_properties',
      },
      render: FormComponents.MapSelect,
    },
    extra_straatverlichting_niet_op_kaart: {
      meta: {
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting',
        },
        ifOneOf: {
          extra_straatverlichting_probleem: [
            'lamp_doet_het_niet',
            'lamp_brandt_overdag',
            'geeft_lichthinder',
            'lamp_is_vervuild',
            'lamp_is_zichtbaar_beschadigd',
            'overig',
          ],
        },
        pathMerge: 'extra_properties',
        value: 'Het lichtpunt staat niet op de kaart',
      },
      render: FormComponents.CheckboxInput,
    },
    extra_straatverlichting_niet_op_kaart_nummer: {
      meta: {
        label: 'Weet u het nummer dat op het lichtpunt staat?',
        pathMerge: 'extra_properties',
        placeholder: 'Nummer lichtpunt',
        newItemText: '+ Voeg een extra nummer toe',
        itemClassName: 'col-3',
        ifAllOf: {
          extra_straatverlichting_niet_op_kaart: true,
          subcategory: 'lantaarnpaal-straatverlichting',
        },
        ifOneOf: {
          extra_straatverlichting_probleem: [
            'lamp_doet_het_niet',
            'lamp_brandt_overdag',
            'geeft_lichthinder',
            'lamp_is_vervuild',
            'lamp_is_zichtbaar_beschadigd',
            'overig',
          ],
        },
      },
      render: FormComponents.MultiTextInput,
    },

    extra_klok: {
      meta: {
        label: 'Is de situatie gevaarlijk?',
        ifAllOf: {
          subcategory: 'klok',
        },
        values: {
          is_gevolg_van_aanrijding: 'Het is het gevolg van een aanrijding',
          klok_op_grond_of_scheef: 'Klok ligt op de grond of staat gevaarlijk scheef',
          deurtje_weg_of_open: 'Deurtje in de mast is niet aanwezig of staat open',
          losse_kabels_zichtbaar_of_lamp_los: 'Er zijn losse electriciteitskabels zichtbaar of er hangt een lamp los',
          niet_gevaarlijk: 'Niet gevaarlijk',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.RadioInput,
    },
    extra_klok_gevaar: {
      meta: {
        className: 'col-sm-12 col-md-8',
        ifAllOf: {
          subcategory: 'klok',
        },
        ifOneOf: {
          extra_klok: [
            'is_gevolg_van_aanrijding',
            'klok_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los',
          ],
        },
        type: 'alert',
        value: [
          'Bel direct 14 020. U hoeft dit formulier niet meer verder in te vullen.',
        ],
      },
      render: FormComponents.PlainText,
    },
    extra_klok_probleem: {
      meta: {
        label: 'Wat is het probleem?',
        ifAllOf: {
          subcategory: 'klok',
        },
        ifOneOf: {
          extra_klok: [
            'is_gevolg_van_aanrijding',
            'klok_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los',
            'niet_gevaarlijk',
          ],
        },
        values: {
          klok_staat_niet_op_tijd_of_stil: 'Klok staat niet op tijd of staat stil',
          klok_is_zichtbaar_beschadigd: 'Klok is zichtbaar beschadigd',
          klok_is_vervuild: 'Klok is vervuild of heeft aanslag',
          overig: 'Overig',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.RadioInput,
    },
    extra_klok_nummer: {
      meta: {
        label: 'Selecteer de klok waar het om gaat',
        ifAllOf: {
          subcategory: 'klok',
        },
        ifOneOf: {
          extra_klok_probleem: [
            'klok_staat_niet_op_tijd_of_stil',
            'klok_is_zichtbaar_beschadigd',
            'klok_is_vervuild',
            'overig',
          ],
        },
        endpoint: configuration.OVL_KLOKKEN_LAYER,
        legend_items: [
          'klok',
        ],
        zoomMin: 14,
        pathMerge: 'extra_properties',
      },
      render: FormComponents.MapSelect,
    },
    extra_klok_niet_op_kaart: {
      meta: {
        ifAllOf: {
          subcategory: 'klok',
        },
        ifOneOf: {
          extra_klok_probleem: [
            'klok_staat_niet_op_tijd_of_stil',
            'klok_is_zichtbaar_beschadigd',
            'klok_is_vervuild',
            'overig',
          ],
        },
        pathMerge: 'extra_properties',
        value: 'De klok staat niet op de kaart',
      },
      render: FormComponents.CheckboxInput,
    },
    extra_klok_niet_op_kaart_nummer: {
      meta: {
        label: 'Weet u het nummer dat op de klok staat?',
        pathMerge: 'extra_properties',
        placeholder: 'Nummer klok',
        ifAllOf: {
          extra_klok_niet_op_kaart: true,
          subcategory: 'klok',
        },
        itemClassName: 'col-3',
        newItemText: '+ Voeg een extra nummer toe',
        ifOneOf: {
          extra_klok_probleem: [
            'klok_staat_niet_op_tijd_of_stil',
            'klok_is_zichtbaar_beschadigd',
            'klok_is_vervuild',
            'overig',
          ],
        },
      },
      render: FormComponents.MultiTextInput,
    },

    extra_verkeerslicht: {
      meta: {
        label: 'Is de situatie gevaarlijk?',
        ifAllOf: {
          subcategory: 'verkeerslicht',
        },
        values: {
          is_gevolg_van_aanrijding: 'Het is het gevolg van een aanrijding',
          verkeerslicht_op_grond_of_scheef: 'Verkeerslicht ligt op de grond of staat gevaarlijk scheef',
          deurtje_weg_of_open: 'Deurtje in de mast is niet aanwezig of staat open',
          losse_kabels_zichtbaar_of_lamp_los: 'Er zijn losse electriciteitskabels zichtbaar of er hangt een lamp los',
          niet_gevaarlijk: 'Niet gevaarlijk',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.RadioInput,
    },
    extra_verkeerslicht_gevaar: {
      meta: {
        className: 'col-sm-12 col-md-8',
        ifAllOf: {
          subcategory: 'verkeerslicht',
        },
        ifOneOf: {
          extra_verkeerslicht: [
            'is_gevolg_van_aanrijding',
            'verkeerslicht_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los',
          ],
        },
        type: 'alert',
        value: [
          'Bel direct 14 020. U hoeft dit formulier niet meer verder in te vullen.',
        ],
      },
      render: FormComponents.PlainText,
    },
    extra_verkeerslicht_welk: {
      meta: {
        label: 'Welk verkeerslicht werkt niet juist?',
        ifAllOf: {
          subcategory: 'verkeerslicht',
        },
        ifOneOf: {
          extra_verkeerslicht: [
            'is_gevolg_van_aanrijding',
            'verkeerslicht_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los',
            'niet_gevaarlijk',
          ],
        },
        values: {
          voetganger: 'Voetganger',
          fiets: 'Fiets',
          auto: 'Auto',
          tram_bus: 'Tram of bus',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.RadioInput,
    },
    extra_verkeerslicht_probleem_voetganger: {
      meta: {
        label: 'Wat is het probleem?',
        ifAllOf: {
          subcategory: 'verkeerslicht',
          extra_verkeerslicht_welk: 'voetganger',
        },
        ifOneOf: {
          extra_verkeerslicht_welk: [
            'voetganger',
          ],
        },
        values: {
          rood_werkt_niet: 'Rood licht werkt niet',
          groen_werkt_niet: 'Groen licht werkt niet',
          blindentikker_werkt_niet: 'Blindentikker werkt niet',
          groen_duurt_te_lang: 'Duurt (te) lang voordat het groen wordt',
          anders: 'Anders',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.CheckboxInput,
    },
    extra_verkeerslicht_probleem_fiets_auto: {
      meta: {
        label: 'Wat is het probleem?',
        ifAllOf: {
          subcategory: 'verkeerslicht',
        },
        ifOneOf: {
          extra_verkeerslicht_welk: [
            'fiets',
            'auto',
          ],
        },
        values: {
          rood_werkt_niet: 'Rood licht werkt niet',
          oranje_werkt_niet: 'Oranje/geel licht werkt niet',
          groen_werkt_niet: 'Groen licht werkt niet',
          groen_duurt_te_lang: 'Duurt (te) lang voordat het groen wordt',
          anders: 'Anders',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.CheckboxInput,
    },
    extra_verkeerslicht_probleem_bus_tram: {
      meta: {
        label: 'Wat is het probleem?',
        ifAllOf: {
          subcategory: 'verkeerslicht',
          extra_verkeerslicht_welk: 'tram_bus',
        },
        values: {
          rood_werkt_niet: 'Rood licht werkt niet',
          oranje_werkt_niet: 'Oranje/geel licht werkt niet',
          wit_werkt_niet: 'Wit licht werkt niet',
          waarschuwingslicht_tram_werkt_niet: 'Waarschuwingslicht tram werkt niet',
          anders: 'Anders',
        },
        pathMerge: 'extra_properties',
      },
      options: {
        validators: [
          Validators.required,
        ],
      },
      render: FormComponents.CheckboxInput,
    },
    extra_verkeerslicht_rijrichting: {
      meta: {
        label: 'Wat is de rijrichting?',
        subtitle: 'Bijvoorbeeld: In de richting van Waterlooplein naar Mr. Visserplein',
        pathMerge: 'extra_properties',
        placeholder: 'Rijrichting verkeerslicht',
        ifAllOf: {
          subcategory: 'verkeerslicht',
        },
        ifOneOf: {
          extra_verkeerslicht_welk: [
            'voetganger',
            'fiets',
            'auto',
            'tram_bus',
          ],
        },
      },
      render: FormComponents.TextInput,
    },
    extra_verkeerslicht_nummer: {
      meta: {
        label: 'Weet u het nummer van het verkeerslicht?',
        subtitle: 'Deze kunt u meestal vinden in witte tekst onder of boven de lampen',
        pathMerge: 'extra_properties',
        placeholder: 'Nummer verkeerslicht',
        ifAllOf: {
          subcategory: 'verkeerslicht',
        },
        className: 'col-sm-12 col-md-6',
        ifOneOf: {
          extra_verkeerslicht_welk: [
            'voetganger',
            'fiets',
            'auto',
            'tram_bus',
          ],
        },
      },
      render: FormComponents.TextInput,
    },


    extra_fietsrek_aanvragen: {
      meta: {
        ifAllOf: {
          subcategory: 'fietsrek-nietje',
        },
        label: 'Wilt u misschien een nieuw fietsenrek of \'nietje\' aanvragen?',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, dat ik wil ik',
          nee: 'Nee, ik wil direct verder gaan',
        },
      },
      render: FormComponents.RadioInput,
    },
    extra_fietsrek_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'fietsrek-nietje',
          extra_fietsrek_aanvragen: 'ja',
        },
        type: 'caution',
        value: [
          <DefinitionComponents.Concat
            items={[
              'Woont u in Nieuw-West of in Oost? Dan doet u uw aanvraag op een andere manier: kijk op de pagina ',
              <DefinitionComponents.Anchor href="https://www.amsterdam.nl/veelgevraagd/?caseid=%7B9E33EFCF-E0C7-4565-B121-1ADCF803679B%7D">Hoe kan ik een fietsenrek aanvragen?</DefinitionComponents.Anchor>,
              '.',
            ]}
          />,
        ],
        pathMerge: 'extra_properties',
      },
      render: FormComponents.PlainText,
    },
    extra_fietsrek_aanvraag: {
      meta: {
        ifAllOf: {
          subcategory: 'fietsrek-nietje',
          extra_fietsrek_aanvragen: 'ja',
        },
        label: 'Fietsenrek of \'nietje\' aanvragen',
        pathMerge: 'extra_properties',
      },
      render: FormComponents.TextareaInput,
    },

    // redirect_to_kim: {
    // meta: {
    // ifOneOf: {
    // subcategory: [
    // 'klok',
    // 'lantaarnpaal-straatverlichting',
    // 'verkeerslicht'
    // ]
    // },
    // label: 'Redirect naar',
    // value: 'Voor meldingen over openbare verlichting, klokken en verkeerslichten is een apart formulier beschikbaar',
    // buttonLabel: 'Meteen doorgaan',
    // buttonAction: 'https://formulieren.amsterdam.nl/TripleForms/DirectRegelen/formulier/nl-NL/evAmsterdam/scMeldingenovl.aspx',
    // buttonTimeout: 5000
    // },
    // render: FormComponents.RedirectButton
    // },
    // hide_navigation_buttons: {
    // meta: {
    // ifOneOf: {
    // subcategory: [
    // 'klok',
    // 'lantaarnpaal-straatverlichting',
    // 'verkeerslicht'
    // ]
    // },
    // ignoreVisibility: true
    // }
    // },

    $field_0: {
      isStatic: false,
      render: IncidentNavigation,
    },
  },
};
