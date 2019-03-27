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
          yesNo: 'ja'
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
          yesNo: 'ja',
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
          yesNo: 'nee'
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
          yesNo: 'nee',
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
