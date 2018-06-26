// import { Validators } from 'react-reactive-form';

import IncidentNavigation from '../components/IncidentNavigation';

import FormComponents from '../components/IncidentForm/components/';

export default {
  label: 'Dit hebben we nog van u nodig',
  form: {
    controls: {
      custom_text: {
        meta: {
          label: 'Dit hebt u net ingevuld:',
          type: 'citation',
          field: 'description'
        },
        render: FormComponents.PlainText
      },
      extra_naamboot: {
        meta: {
          cols: 6,
          label: 'Wat is de naam van de boot? (niet verplicht)',
          type: 'text',
          if: {
            subcategory: 'Overlast op het water - geluid'
          }
        },
        render: FormComponents.TextInput
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation
      }
    }
  }
};

// MVP
// Overlast op het water - geluid
// Overlast op het water - snel varen
// Overlast op het water - Gezonken boot
