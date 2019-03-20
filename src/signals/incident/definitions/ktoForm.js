/* eslint-disable react/prop-types */
import React from 'react';

import { Validators } from 'react-reactive-form';

import FormComponents from '../components/IncidentForm/components/';

export default {
  controls: {
    tevreden: {
      meta: {
        label: 'Waarom bent u tevreden?',
        subtitle: 'Eén antwoord mogelijk, kies de belangrijkste reden.',
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
          tevreden: 'Anders, namelijk...'
        }
      },
      render: FormComponents.TextareaInput
    },
    tevreden_toelichten: {
      meta: {
        label: 'Wilt u verder nog iets vermelden of toelichten?'
      },
      render: FormComponents.TextareaInput
    },
    tevreden_toestemming: {
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
            className="action primary"
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
