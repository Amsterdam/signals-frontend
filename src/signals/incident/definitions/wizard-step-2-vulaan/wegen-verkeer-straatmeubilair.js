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

    extra_straatverlichting: {
      meta: {
        label: 'Is de situatie gevaarlijk?',
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting'
        },
        values: {
          is_gevolg_van_aanrijding: 'Het is het gevolg van een aanrijding',
          lamp_op_grond_of_scheef: 'Lamp ligt op de grond of staat gevaarlijk scheef',
          deurtje_weg_of_open: 'Deurtje in de mast is niet aanwezig of staat open',
          losse_kabels_zichtbaar_of_lamp_los: 'Er zijn losse electriciteitskabels zichtbaar of er hangt een lamp los',
          niet_gevaarlijk: 'Niet gevaarlijk'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.RadioInput
    },
    extra_straatverlichting_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting',
        },
        ifOneOf: {
          extra_straatverlichting: [
            'is_gevolg_van_aanrijding',
            'lamp_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los'
          ]
        },
        type: 'caution',
        value: [
          'Direct gevaar? Bel direct 14 020. U hoeft dit formulier niet meer verder in te vullen.'
        ],
      },
      render: FormComponents.PlainText
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
            'niet_gevaarlijk'
          ]
        },
        values: {
          '1_lichtpunt': '1 lichtpunt',
          meerdere_lichtpunten: 'Een aantal lichtpunten die bij elkaar staan/hangen'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.RadioInput
    },
    extra_straatverlichting_probleem: {
      meta: {
        label: 'Wat is het probleem?',
        ifAllOf: {
          subcategory: 'lantaarnpaal-straatverlichting'
        },
        ifOneOf: {
          extra_straatverlichting_hoeveel: [
            '1_lichtpunt',
            'meerdere_lichtpunten'
          ]
        },
        values: {
          lamp_doet_het_niet: 'Lamp doet het niet',
          lamp_brandt_overdag: 'Lamp brandt overdag',
          geeft_lichthinder: 'Geeft lichthinder (schijnt bijvoorbeeld in de slaapkamer)',
          paal_staat_scheef: 'Lichtpunt is vervuild of heeft aanslag',
          paal_ligt_over_weg: 'Lichtpunt is zichtbaar beschadigd en/of inpompleet',
          overig: 'Overig'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.RadioInput
    },

    extra_klok: {
      meta: {
        label: 'Is de situatie gevaarlijk?',
        ifAllOf: {
          subcategory: 'klok'
        },
        values: {
          is_gevolg_van_aanrijding: 'Het is het gevolg van een aanrijding',
          klok_op_grond_of_scheef: 'Klok ligt op de grond of staat gevaarlijk scheef',
          deurtje_weg_of_open: 'Deurtje in de mast is niet aanwezig of staat open',
          losse_kabels_zichtbaar_of_lamp_los: 'Er zijn losse electriciteitskabels zichtbaar of er hangt een lamp los',
          niet_gevaarlijk: 'Niet gevaarlijk'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.RadioInput
    },
    extra_klok_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'klok',
        },
        ifOneOf: {
          extra_klok: [
            'is_gevolg_van_aanrijding',
            'klok_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los'
          ]
        },
        type: 'caution',
        value: [
          'Direct gevaar? Bel direct 14 020. U hoeft dit formulier niet meer verder in te vullen.'
        ],
      },
      render: FormComponents.PlainText
    },
    extra_klok_probleem: {
      meta: {
        label: 'Wat is het probleem?',
        ifAllOf: {
          subcategory: 'klok'
        },
        ifOneOf: {
          extra_klok: [
            'is_gevolg_van_aanrijding',
            'klok_op_grond_of_scheef',
            'deurtje_weg_of_open',
            'losse_kabels_zichtbaar_of_lamp_los',
            'niet_gevaarlijk'
          ]
        },
        values: {
          klok_staat_niet_op_tijd: 'Klok staat niet op tijd',
          klok_is_zichtbaar_beschadigd: 'Klok is zichtbaar beschadigd',
          klok_is_vervuild: 'Klok is vervuild of heeft aanslag',
          overuig: 'Overig'
        },
        pathMerge: 'extra_properties'
      },
      render: FormComponents.RadioInput
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
          extra_fietsrek_aanvragen: 'ja'
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
          extra_fietsrek_aanvragen: 'ja'
        },
        label: 'Fietsenrek of \'nietje\' aanvragen',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.TextareaInput
    },

    redirect_to_kim: {
      meta: {
        ifOneOf: {
          subcategory: [
            'verkeerslicht'
          ]
        },
        label: 'Redirect naar',
        value: 'Voor meldingen over openbare verlichting, klokken en verkeerslichten is een apart formulier beschikbaar',
        buttonLabel: 'Meteen doorgaan',
        buttonAction: 'https://formulieren.amsterdam.nl/TripleForms/DirectRegelen/formulier/nl-NL/evAmsterdam/scMeldingenovl.aspx',
        buttonTimeout: 5000
      },
      render: FormComponents.RedirectButton
    },
    hide_navigation_buttons: {
      meta: {
        ifOneOf: {
          subcategory: [
            'verkeerslicht'
          ]
        },
        ignoreVisibility: true
      }
    },

    $field_0: {
      isStatic: false,
      render: IncidentNavigation
    }
  }
};
