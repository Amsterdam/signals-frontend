import React from 'react';

import DefinitionComponents from '../components/';
import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

export default {
  controls: {
    custom_text: {
      meta: {
        label: 'Dit hebt u net ingevuld:',
        type: 'citation',
        value: '{incident.description}',
        ignoreVisibility: true
      },
      render: FormComponents.PlainText
    },

    extra_brug: {
      meta: {
        ifAllOf: {
          subcategory:
            'brug'
        },
        label: 'Hebt u een naam of nummer van de brug?',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_onderhoud_stoep_straat_en_fietspad: {
      meta: {
        ifOneOf: {
          subcategory: [
            'onderhoud-stoep-straat-en-fietspad',
            'gladheid'
          ]
        },
        label: 'Hebt u verteld om wat voor soort wegdek het gaat?',
        subheader: 'Bijvoorbeeld: asfalt, klinkers of stoeptegels',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_wegen_gladheid: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'gladheid'
        },
        type: 'caution',
        value: [
          'Let op:',
          'Is het glad bij een trein-, bus- of metrostation? Neem dan contact op met de NS of GVB:',
          <DefinitionComponents.A href="http://ns.nl/klantenservice" target="_blank" className="more-link">ns.nl/klantenservice</DefinitionComponents.A>,
          <DefinitionComponents.A href="http://gvb.nl/klantenservice" target="_blank" className="more-link">gvb.nl/klantenservice</DefinitionComponents.A>
        ],
        pathMerge: 'extra_properties'
      },
      render: FormComponents.PlainText
    },
    extra_straatverlichting_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'straatverlichting-openbare-klok'
        },
        type: 'caution',
        value: [
          'Direct gevaar? Bel 14 020 en vul dit formulier niet verder in.',
          'Direct gevaar is bijvoorbeeld:',
          <DefinitionComponents.Ul
            items={[
              'Paal, stoplicht of lamp ligt op de grond of is verbogen',
              'Deurtje in de paal staat open',
              'Er zijn losse elektriciteitsdraden te zien of er hangt een lamp los'
            ]}
          />,
          'Let op: met het nummer van het stoplicht (3 witte cijfers bij de lichten) kunnen wij de melding sneller oplossen.'
        ],
        pathMerge: 'extra_properties'
      },
      render: FormComponents.PlainText
    },
    extra_straatverlichting: {
      meta: {
        label: 'Gaat uw melding over één of over meer lampen?',
        ifAllOf: {
          subcategory: 'straatverlichting-openbare-klok'
        },
        values: {
          een_lamp: 'Eén lamp',
          meer_lampen: 'Meer lampen'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.RadioInput
    },
    extra_straatverlichting_wat: {
      meta: {
        label: 'Wat is er aan de hand met de lamp(en)?',
        ifAllOf: {
          subcategory: 'straatverlichting-openbare-klok'
        },
        values: {
          brandt_niet: 'Brandt niet',
          brandt_overdag: 'Brandt overdag',
          geeft_lichthinder: 'Geeft lichthinder (schijnt bijvoorbeeld in de slaapkamer)',
          paal_staat_scheef: 'Paal staat scheef',
          paal_ligt_over_weg: 'Paal ligt over de weg',
          deurtje_van_paal_staat_open: 'Het deurtje van de paal staat open (schokgevaar)'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_straatverlichting_waar: {
      meta: {
        label: 'Waar staat/staan de lamp(en)?',
        ifAllOf: {
          subcategory: 'straatverlichting-openbare-klok'
        },
        values: {
          op_stoep: 'Op de stoep',
          op_brug: 'Op een brug',
          in_tunnel: 'In een tunnel',
          bij_gebouw_om_gebouw_verlichten: 'Bij een gebouw: om het gebouw te verlichten',
          de_lampen_hangen: 'De lampen hangen'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_straatverlichting_nummer: {
      meta: {
        ifAllOf: {
          subcategory: 'straatverlichting-openbare-klok'
        },
        label: 'Hebt u een nummer van (één van) de lamp(en)?',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_klok: {
      meta: {
        label: 'Wat is er aan de hand met de klok',
        ifAllOf: {
          subcategory: 'klok'
        },
        values: {
          loopt_niet_op_tijd: 'Loopt niet op tijd',
          lamp_is_stuk: 'Lamp is stuk',
          is_aangereden: 'Is aangereden',
          deurtje_van_paal_staat_open: 'Het deurtje van de paal staat open',
          is_zichtbaar_beschadigd: 'Is zichtbaar beschadigd'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_klok_nummer: {
      meta: {
        ifAllOf: {
          subcategory: 'klok'
        },
        label: 'Hebt u een nummer de klok?',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_verkeerslicht_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'verkeerslicht'
        },
        type: 'caution',
        value: [
          'Direct gevaar? Bel 14 020 en vul dit formulier niet verder in.',
          'Direct gevaar is bijvoorbeeld:',
          <DefinitionComponents.Ul
            items={[
              'Paal, stoplicht of lamp ligt op de grond of is verbogen',
              'Deurtje in de paal staat open',
              'Er zijn losse elektriciteitsdraden te zien of er hangt een lamp los'
            ]}
          />,
          'Let op: met het nummer van het stoplicht (3 witte cijfers bij de lichten) kunnen wij de melding sneller oplossen.'
        ],
        pathMerge: 'extra_properties'
      },
      render: FormComponents.PlainText
    },
    extra_verkeerslicht: {
      meta: {
        label: 'Om wat voor soort stoplicht(en) het gaat?',
        ifAllOf: {
          subcategory: 'verkeerslicht'
        },
        values: {
          voetganger: 'Voetganger',
          fiets: 'Fiets',
          blindentikker: 'Blindentikker',
          auto_stoplicht: 'Auto (algemeen) stoplicht'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_verkeerslicht_wat: {
      meta: {
        label: 'Wat is er aan de hand met het/de stoplichten(en)?',
        ifAllOf: {
          subcategory: 'verkeerslicht'
        },
        values: {
          rode_licht_is_stuk: 'Rode licht is stuk',
          oranje_licht_is_stuk: 'Oranje licht is stuk',
          groene_licht_is_stuk: 'Groene licht is stuk',
          blijft_op_rood_staan: 'Blijft (te lang) op rood staan',
          is_aangereden: 'Is aangereden',
          deurtje_van_paal_staat_open: 'Het deurtje van de paal staat open',
          drukknop_is_stuk: 'Drukknop is stuk',
          blindentikker_is_stuk: 'Blindentikker is stuk',
          anders: 'Anders:'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_verkeerslicht_anders: {
      meta: {
        ifAllOf: {
          subcategory: 'verkeerslicht'
        },
        ifOneOf: {
          extra_verkeerslicht_wat: 'Anders:'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextareaInput
    },
    extra_verkeerslicht_nummer: {
      meta: {
        ifAllOf: {
          subcategory: 'verkeerslicht'
        },
        label: 'Hebt u een nummer van het stoplicht?',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextInput
    },
    extra_fietsrek_aanvragen: {
      meta: {
        ifAllOf: {
          subcategory: 'fietsrek-nietje'
        },
        label: 'Wilt u misschien een nieuw fietsenrek of \'nietje\' aanvragen?',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja, dat ik wil ik',
          nee: 'Nee, ik wil direct verder gaan'
        }
      },
      render: FormComponents.RadioInput
    },
    extra_fietsrek_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'fietsrek-nietje',
          extra_fietsrek_aanvragen: 'Ja, dat ik wil ik'
        },
        type: 'caution',
        value: [
          <DefinitionComponents.Concat
            items={[
              'Woont u in Nieuw-West of in Oost? Dan doet u uw aanvraag op een andere manier: kijk op de pagina ',
              <DefinitionComponents.A href="https://www.amsterdam.nl/veelgevraagd/?caseid=%7B9E33EFCF-E0C7-4565-B121-1ADCF803679B%7D">Hoe kan ik een fietsenrek aanvragen?</DefinitionComponents.A>,
              '.'
            ]}
          />
        ],
        pathMerge: 'extra_properties'
      },
      render: FormComponents.PlainText
    },
    extra_fietsrek_aanvraag: {
      meta: {
        ifAllOf: {
          subcategory: 'fietsrek-nietje',
          extra_fietsrek_aanvragen: 'Ja, dat ik wil ik'
        },
        label: 'Fietsenrek of \'nietje\' aanvragen',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextareaInput
    },

    // redirect_to_kim: {
    //   meta: {
    //     ifOneOf: {
    //       subcategory: [
    //         'straatverlichting-openbare-klok',
    //         'verkeerslicht'
    //       ]
    //     },
    //     label: 'Redirect naar',
    //     value: 'Voor meldingen over openbare verlichting, klokken en verkeerslichten is een apart formulier beschikbaar',
    //     buttonLabel: 'Meteen doorgaan',
    //     buttonAction: 'https://formulieren.amsterdam.nl/TripleForms/DirectRegelen/formulier/nl-NL/evAmsterdam/scMeldingenovl.aspx',
    //     buttonTimeout: 5000
    //   },
    //   render: FormComponents.RedirectButton
    // },
    // hide_navigation_buttons: {
    //   meta: {
    //     ifOneOf: {
    //       subcategory: [
    //         'straatverlichting-openbare-klok',
    //         'verkeerslicht'
    //       ]
    //     },
    //     ignoreVisibility: true
    //   }
    // },
    $field_0: {
      isStatic: false,
      render: IncidentNavigation
    }
  }
};
