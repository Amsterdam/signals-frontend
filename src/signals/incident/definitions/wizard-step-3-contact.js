// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

import FormComponents from '../components/form'
import IncidentNavigation from '../components/IncidentNavigation'
import { validatePhoneNumber } from '../services/custom-validators/custom-validators'

export default {
  label: 'Contactgegevens',
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  form: {
    controls: {
      phone_email_text: {
        meta: {
          type: 'message',
          heading:
            'Mogen we u bellen voor vragen? En op de  hoogte houden via e-mail?',
          value: `Vaak hebben we nog een vraag. Daarmee kunnen we het probleem sneller of beter oplossen. Of we willen iets uitleggen. Wij willen u dan graag even bellen. Of anders e-mailen wij u.
            \n Wij gebruiken uw telefoonnummer en e-mailadres alleen voor deze melding.`,
          wrappedComponent: FormComponents.PlainText,
        },
        render: FormComponents.WithHeading,
      },
      phone: {
        meta: {
          // https://bytes.grubhub.com/disabling-safari-autofill-for-a-single-line-address-input-b83137b5b1c7
          autoComplete: 'tel',
          autoRemove: /[^\d ()+-]/g,
          label: 'Wat is uw telefoonnummer?',
          path: 'reporter.phone',
          subtitle: '',
          type: 'tel',
          width: '50%',
        },
        render: FormComponents.TextInput,
        options: {
          validators: [validatePhoneNumber, ['maxLength', 17]],
        },
      },
      email: {
        meta: {
          autoComplete: 'email',
          autoRemove: /[^\w!#$%&'*+./;=?@^`{|}~-]/g,
          label: 'Wat is uw e-mailadres?',
          path: 'reporter.email',
          subtitle: '',
          type: 'email',
        },
        render: FormComponents.TextInput,
        options: {
          validators: ['email', ['maxLength', 100]],
        },
      },
      privacy_text: {
        meta: {
          type: 'message',
          heading: 'Mogen we uw melding doorsturen?',
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
