import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Fout',
  form: {
    controls: {
      text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Momenteel zijn er problemen met deze website en kan uw melding niet verwerkt worden.',
          type: 'bedankt',
          value: [
            'Probeert u het later nogmaals.',
            'Voor spoedeisende zaken kunt u ook telefonisch contact opnemen met 14 020.'
          ]
        },
        render: FormComponents.PlainText
      }
    }
  }
};
