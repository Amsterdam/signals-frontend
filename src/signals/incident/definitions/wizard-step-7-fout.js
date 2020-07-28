import configuration from 'shared/services/configuration/configuration';

import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/form';

export default {
  label: 'Fout',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  form: {
    controls: {
      text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Momenteel zijn er problemen met deze website en kan uw melding niet verwerkt worden.',
          type: 'bedankt',
          value: ['Probeert u het later nogmaals.', configuration.language?.urgentContactInfo],
        },
        render: FormComponents.PlainText,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
};
