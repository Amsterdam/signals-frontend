import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Fout',
  form: {
    controls: {
      text: {
        meta: {
          cols: 6,
          label: 'Er is iets fout gegaan.',
          type: 'bedankt',
          value: [
            'Kunt u het later nogmaals proberen?'
          ]
        },
        render: FormComponents.PlainText
      }
    }
  }
};
