/* eslint-disable react/prop-types */
import React from 'react';

import { Validators } from 'react-reactive-form';

import FormComponents from '../components/IncidentForm/components';

export default {
  controls: {
    tevreden: {
      meta: {
        label: 'Waarom bent u tevreden?',
        subtitle: 'Eén antwoord mogelijk, kies de belangrijkste reden.',
        ifAllOf: {
          is_satisfied: true
        },
        values: {}
      },
      render: FormComponents.RadioInput,
      options: {
        validators: [
          Validators.required
        ]
      },
    },
    tevreden_anders: {
      meta: {
        ifAllOf: {
          is_satisfied: true,
          tevreden: 'Anders, namelijk...'
        }
      },
      render: FormComponents.TextareaInput
    },
    niet_tevreden: {
      meta: {
        label: 'Waarom bent u ontevreden?',
        subtitle: 'Eén antwoord mogelijk, kies de belangrijkste reden.',
        ifAllOf: {
          is_satisfied: false
        },
        values: {}
      },
      render: FormComponents.RadioInput,
      options: {
        validators: [
          Validators.required
        ]
      },
    },
    niet_tevreden_anders: {
      meta: {
        ifAllOf: {
          is_satisfied: false,
          niet_tevreden: 'Anders, namelijk...'
        }
      },
      render: FormComponents.TextareaInput
    },
    text_extra: {
      meta: {
        label: 'Wilt u verder nog iets vermelden of toelichten?'
      },
      render: FormComponents.TextareaInput
    },
    is_satisfied: {
      meta: {
        label: 'Is tevreden?'
      },
      render: FormComponents.HiddenInput
    },
    allows_contact: {
      meta: {
        label: 'Mogen wij conact met u opnemen naar aanleiding vanuw feedback?'
      },
      render: FormComponents.CheckboxInput
    },
    $field_0: {
      isStatic: false,
      render: ({ invalid }) => (
        <div>
          <button
            className={`kto-form__submit action primary ${invalid && 'disabled'}`}
            type="submit"
            disabled={invalid}
          >
            Verstuur
          </button>
        </div>
      )
    }
  }
};
