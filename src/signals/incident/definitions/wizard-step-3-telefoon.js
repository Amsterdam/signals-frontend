import { Validators } from 'react-reactive-form';
import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Mogen we u bellen voor vragen?',
  form: {
    controls: {
      phone: {
        meta: {
          label: 'Wat is uw telefoonnummer? (niet verplicht)',
          subtitle: 'Zo kunt u ons helpen het probleem sneller of beter op te lossen.',
          path: 'reporter.phone',
          placeholder: 'Telefoonnummer',
          type: 'text'
        },
        render: FormComponents.TextInput,
        options: {
          validators: [Validators.required, Validators.maxLength(17)]
        },
      },
      privacy_text: {
        meta: {
          cols: 6,
          label: 'Uw privacy',
          type: 'disclaimer',
          value: 'We gebruiken uw telefoonnummer alléén om nog iets te kunnen vragen over uw melding. We wissen uw telefoonnummer binnen 2 weken nadat we uw melding hebben afgehandeld.'
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
