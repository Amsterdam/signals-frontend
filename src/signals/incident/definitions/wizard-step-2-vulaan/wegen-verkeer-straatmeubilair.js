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
  }
};
