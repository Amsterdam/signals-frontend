import FormComponents from '../../components/IncidentForm/components/';

export default {
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
        'Is het glad bij een trein-, bus- of metrostation? Neem dan contact op met de NS of GVB:'
      ]
    },
    render: FormComponents.PlainText
  }
};
