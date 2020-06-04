import { Validators } from 'react-reactive-form';

import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/form';

export default {
  label: 'Wilt u op de hoogte blijven?',
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  form: {
    controls: {
      email: {
        meta: {
          label: 'Wat is uw e-mailadres?',
          subtitle: 'We mailen om u te vertellen wat we met uw melding doen en wanneer het klaar is.',
          path: 'reporter.email',
          placeholder: 'E-mailadres',
          type: 'email',
          autoRemove: /[^a-zA-Z0-9@.!#$%&'*+\-/=?^_`{|}~;]/g,
          autoFocus: true,
        },
        render: FormComponents.TextInput,
        options: {
          validators: [
            Validators.email,
            Validators.maxLength(254),
          ],
        },
      },
      privacy_text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Uw privacy',
          type: 'disclaimer',
          value: 'We gebruiken uw e-mailadres alléén om u op de hoogte houden, of wanneer wij een vraag hebben en u niet per telefoon kunnen bereiken.',
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
