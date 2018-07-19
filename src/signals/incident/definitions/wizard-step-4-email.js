import { Validators } from 'react-reactive-form';

import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Wilt u op de hoogte blijven?',
  form: {
    controls: {
      email: {
        meta: {
          label: 'Wat is uw e-mailadres? (niet verplicht)',
          subtitle: 'We mailen om u te vertellen wat we met uw melding doen. En wanneer het klaar is.',
          path: 'reporter.email',
          placeholder: 'E-mail adres',
          type: 'text'
        },
        render: FormComponents.TextInput,
        options: {
          validators: [Validators.email, Validators.maxLength(254)]
        },
      },
      privacy_text: {
        meta: {
          cols: 6,
          label: 'Uw privacy',
          type: 'disclaimer',
          value: 'We gebruiken uw e-mailadres alléén om u op de hoogte houden, of wanneer wij een vraag hebben en u niet per telefoon kunnen bereiken. We wissen uw e-mailadres er binnen 2 weken nadat we uw melding hebben afgehandeld.'
        },
        render: FormComponents.PlainText
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation
      }
    }
  }
};
