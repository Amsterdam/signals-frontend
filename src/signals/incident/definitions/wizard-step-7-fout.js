import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Fout',
  form: {
    controls: {
      text: {
        meta: {
          cols: 6,
          label: 'Momenteel zijn er problemen met deze website en kan uw melding niet verwerkt worden.',
          type: 'bedankt',
          value: [
            'Probeert u het later nogmaals.'
          ]
        },
        render: FormComponents.PlainText
      }
    }
  }
};
