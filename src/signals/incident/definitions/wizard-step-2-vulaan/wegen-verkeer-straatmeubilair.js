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
  extra_onderhoud_stoep_straat_en_fietspad: {
    meta: {
      ifAllOf: {
        subcategory:
          'onderhoud-stoep-straat-en-fietspad'
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
          'verkeerslicht',
          'klok'
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
          'verkeerslicht',
          'klok'
        ]
      }
    }
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
  }
};
