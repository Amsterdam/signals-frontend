import FormComponents from '../../components/IncidentForm/components/';

export default {
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
        {
          type: 'more-link',
          label: 'ns.nl/klantenservice',
          href: 'http://ns.nl/klantenservice'
        }, {
          type: 'more-link',
          label: 'gvb.nl/klantenservice',
          href: 'http://gvb.nl/klantenservice'
        }
      ],
    },
    render: FormComponents.PlainText
  },
  extra_klok_niet_op_tijd: {
    meta: {
      label: 'Wat is er aan de hand met de klok',
      ifAllOf: {
        subcategory: 'klok'
      },
      value: 'Loopt niet op tijd'
    },
    render: FormComponents.CheckboxInput
  },
  extra_klok_stuk: {
    meta: {
      ifAllOf: {
        subcategory: 'klok'
      },
      value: 'Lamp is stuk'
    },
    render: FormComponents.CheckboxInput
  },
  extra_klok_aangereden: {
    meta: {
      ifAllOf: {
        subcategory: 'klok'
      },
      value: 'Is aangereden'
    },
    render: FormComponents.CheckboxInput
  },
  extra_klok_deurtje_open: {
    meta: {
      ifAllOf: {
        subcategory: 'klok'
      },
      value: 'Het deurtje van de paal staat open'
    },
    render: FormComponents.CheckboxInput
  },
  extra_klok_beschadigd: {
    meta: {
      ifAllOf: {
        subcategory: 'klok'
      },
      value: 'Is zichtbaar beschadigd'
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
  navigation_submit_button: {
    meta: {
      ifNoneOf: {
        subcategory: [
          'straatverlichting-openbare-klok',
          'verkeerslicht'
        ]
      }
    }
  }
};
