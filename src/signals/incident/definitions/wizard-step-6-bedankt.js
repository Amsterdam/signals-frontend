import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/form';

export default {
  label: 'Bedankt!',
  form: {
    controls: {
      text_melding: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          value: 'Uw melding is bij ons bekend onder nummer: {incident.id}.',
          key: 'createdIncident',
        },
        render: FormComponents.PlainText,
      },
      text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Wat doen we met uw melding?',
          type: 'bedankt',
        },
        render: FormComponents.PlainText,
      },
      text_melding_extra: {
        meta: {
          className: 'col-sm-12 col-md-6',
          type: 'bedankt',
          key: 'createdIncident.handling_message',
        },
        render: FormComponents.HandlingMessage,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
};
