import FormComponents from '../../components/IncidentForm/components/';

export default {
  redirect_to_kim: {
    meta: {
      ifAllOf: {
        subcategory:
          'straatverlichting-openbare-klok'
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
        subcategory: 'straatverlichting-openbare-klok'
      }
    }
  }
};
