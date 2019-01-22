import React from 'react';

import DefinitionComponents from '../components/';
import FormComponents from '../../components/IncidentForm/components/';
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
    extra_klok: {
      meta: {
        label: 'Wat is er aan de hand met de klok',
        ifAllOf: {
          subcategory: 'klok'
        }
      },
      render: FormComponents.PlainText
    },
    extra_klok_niet_op_tijd: {
      meta: {
        ifAllOf: {
          subcategory: 'klok'
        },
        value: 'Loopt niet op tijd',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_klok_stuk: {
      meta: {
        ifAllOf: {
          subcategory: 'klok'
        },
        value: 'Lamp is stuk',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_klok_aangereden: {
      meta: {
        ifAllOf: {
          subcategory: 'klok'
        },
        value: 'Is aangereden',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_klok_deurtje_open: {
      meta: {
        ifAllOf: {
          subcategory: 'klok'
        },
        value: 'Het deurtje van de paal staat open',
        pathMerge: 'extra_properties'
      },
      render: FormComponents.CheckboxInput
    },
    extra_klok_beschadigd: {
      meta: {
        ifAllOf: {
          subcategory: 'klok'
        },
        value: 'Is zichtbaar beschadigd',
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
    extra_fietsrek_aanvragen: {
      meta: {
        ifAllOf: {
          subcategory: 'fietsrek-nietje'
        },
        label: 'Wilt u misschien een nieuw fietsenrek of \'nietje\' aanvragen?',
        pathMerge: 'extra_properties',
        values: {
          ja: 'Ja',
          nee: 'Nee'
        }
      },
      render: FormComponents.RadioInput
    },
    extra_fietsrek_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          subcategory: 'fietsrek-nietje',
          extra_fietsrek_aanvragen: 'Ja'
        },
        type: 'caution',
        value: [
          'Woont u in Nieuw-West of in Oost? Dan doet u uw aanvraag op een andere manier:',
          'kijk op de pagina',
          {
            type: 'more-link',
            label: 'Hoe kan ik een fietsenrek aanvragen?',
            href: 'http://ns.nl/klantenservice'
          }
        ],
        pathMerge: 'extra_properties'
      },
      render: FormComponents.PlainText
    },
    extra_fietsrek_aanvraag: {
      meta: {
        ifAllOf: {
          subcategory: 'fietsrek-nietje',
          extra_fietsrek_aanvragen: 'Ja'
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
            'straatverlichting-openbare-klok',
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
            'straatverlichting-openbare-klok',
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
