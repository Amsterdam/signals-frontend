import { Validators } from 'react-reactive-form';
import { validatePhoneNumber } from '../../incident/components/IncidentForm/services/custom-validators';
import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Mogen we u bellen voor vragen?',
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  form: {
    controls: {
      phone: {
        meta: {
          label: 'Wat is uw telefoonnummer?',
          subtitle: 'Zo kunt u ons helpen het probleem sneller of beter op te lossen.',
          path: 'reporter.phone',
          placeholder: 'Telefoonnummer',
          type: 'text',
          autoRemove: /[^ ()\d+-]/g
        },
        render: FormComponents.TextInput,
        options: {
          validators: [
            Validators.maxLength(17),
            validatePhoneNumber
          ]
        },
      },
      privacy_text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label: 'Uw privacy',
          type: 'disclaimer',
          value: 'We gebruiken uw telefoonnummer alléén om nog iets te kunnen vragen over uw melding.'
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
