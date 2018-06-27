// MVP
// Overlast op het water - geluid
// Overlast op het water - snel varen
// Overlast op het water - Gezonken boot

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
      extra_boten_snelheid_rondvaartboot: {
        meta: {
          cols: 6,
          label: 'Gaat de melding over een rondvaartboot?',
          values: {
            ja: 'Ja',
            nee: 'Nee'
          },
          if: {
            subcategory: 'Overlast op het water - snel varen'
          }
        },
        render: FormComponents.RadioInput
      },
      extra_boten_snelheid_rederij: {
        meta: {
          cols: 6,
          label: 'REDERIJ?',
          if: {
            subcategory: 'Overlast op het water - snel varen',
            extra_boten_snelheid_rondvaartboot: 'ja'
          }
        },
        render: FormComponents.TextInput
      },
      extra_boten_snelheid_naamboot: {
        meta: {
          cols: 6,
          label: 'Wat is de naam van de boot? (niet verplicht)',
          if: {
            subcategory: 'Overlast op het water - snel varen'
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
