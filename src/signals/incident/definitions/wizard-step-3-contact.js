// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { Validators } from 'react-reactive-form'

import configuration from 'shared/services/configuration/configuration'
import { validatePhoneNumber } from '../services/custom-validators'
import IncidentNavigation from '../components/IncidentNavigation'
import FormComponents from '../components/form'

export default {
  label: 'Contactgegevens',
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  form: {
    controls: {
      phone: {
        meta: {
          autoComplete: 'tel',
          autoRemove: /[^\d ()+-]/g,
          heading: 'Mogen we u bellen voor vragen?',
          label: 'Wat is uw telefoonnummer?',
          path: 'reporter.phone',
          subtitle:
            'We gebruiken uw telefoonnummer alléén om nog iets te kunnen vragen over uw melding.',
          type: 'tel',
          width: '50%',
          wrappedComponent: FormComponents.TextInput,
        },
        render: FormComponents.WithHeading,
        options: {
          validators: [Validators.maxLength(17), validatePhoneNumber],
        },
      },
      email: {
        meta: {
          autoComplete: 'email',
          autoRemove: /[^\w!#$%&'*+./;=?@^`{|}~-]/g,
          heading: 'Wilt u op de hoogte blijven?',
          label: 'Wat is uw e-mailadres?',
          path: 'reporter.email',
          subtitle:
            'We gebruiken uw e-mailadres alléén om u op de hoogte te houden, of wanneer wij een vraag hebben en u niet per telefoon kunnen bereiken.',
          type: 'email',
          wrappedComponent: FormComponents.TextInput,
        },
        render: FormComponents.WithHeading,
        options: {
          validators: [Validators.email, Validators.maxLength(254)],
        },
      },
      privacy_text: {
        meta: {
          type: 'message',
          heading: 'Melding doorsturen',
          value:
            'Soms kan de gemeente niets doen. Een andere organisatie moet dan aan het werk. Bijvoorbeeld de politie of de dierenambulance. Als dat zo is kunnen wij uw melding doorsturen. Wij sturen uw telefoonnummer of e-mailadres mee. Maar dat doen we alleen als u dat goed vindt.',
          wrappedComponent: FormComponents.PlainText,
        },
        render: FormComponents.WithHeading,
      },
      sharing_allowed: {
        meta: {
          shortLabel: 'Toestemming contactgegevens delen',
          value: configuration.language?.consentToContactSharing,
          path: 'reporter.sharing_allowed',
        },
        render: FormComponents.EmphasisCheckboxInput,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
      help_text: {
        meta: {
          label: configuration.language.helpTextHeader,
          value: configuration.language.helpText,
          ignoreVisibility: true,
        },
        render: FormComponents.PlainText,
      },
    },
  },
}
