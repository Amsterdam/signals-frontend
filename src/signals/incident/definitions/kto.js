/* eslint-disable react/prop-types */
import React from 'react';

import { Validators } from 'react-reactive-form';

import FormComponents from '../components/form';

export default {
  controls: {
    tevreden: {
      meta: {
        label: 'Waarom bent u tevreden?',
        subtitle: 'Eén antwoord mogelijk, kies de belangrijkste reden',
        ifAllOf: {
          is_satisfied: true,
        },
        values: {}, // will be populated from endpoint
      },
      render: FormComponents.RadioInputGroup,
      options: {
        validators: [
          Validators.required,
        ],
      },
    },
    tevreden_anders: {
      meta: {
        className: 'kto-form--collapse-to-previous-question',
        ifAllOf: {
          is_satisfied: true,
          tevreden: 'anders',
        },
      },
      render: FormComponents.TextInput,
    },
    niet_tevreden: {
      meta: {
        label: 'Waarom bent u ontevreden?',
        subtitle: 'Eén antwoord mogelijk, kies de belangrijkste reden',
        ifAllOf: {
          is_satisfied: false,
        },
        values: {}, // will be populated from endpoint
      },
      render: FormComponents.RadioInputGroup,
      options: {
        validators: [
          Validators.required,
        ],
      },
    },
    niet_tevreden_anders: {
      meta: {
        className: 'kto-form--collapse-to-previous-question',
        ifAllOf: {
          is_satisfied: false,
          niet_tevreden: 'anders',
        },
      },
      render: FormComponents.TextInput,
    },
    text_extra: {
      meta: {
        label: 'Wilt u verder nog iets vermelden of toelichten?',
        maxLength: 1000,
      },
      options: {
        validators: [
          Validators.maxLength(1000),
        ],
      },
      render: FormComponents.TextareaInput,
    },
    allows_contact: {
      meta: {
        label: 'Mogen wij contact met u opnemen naar aanleiding van uw feedback?',
        value: 'Ja',
      },
      render: FormComponents.CheckboxInput,
    },
    is_satisfied: {
      meta: {
        label: 'Is tevreden?',
      },
      render: FormComponents.HiddenInput,
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
      ),
    },
  },
};
