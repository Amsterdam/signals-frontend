// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam

import configuration from 'shared/services/configuration/configuration'
import IncidentNavigation from '../components/IncidentNavigation'
import FormComponents from '../components/form'

const navigation = configuration.featureFlags.appMode
  ? {
      app_close_window_action: {
        meta: {
          title: 'Wilt u nog een andere melding doen?',
          labelCloseButton: 'Sluit venster',
          labelLinkButton: 'Doe een melding',
          hrefLinkButton: '/',
        },
        render: FormComponents.AppNavigation,
      },
    }
  : {
      next_incident_action: {
        meta: {
          label: 'Doe een melding',
          href: '/',
        },
        render: FormComponents.LinkButton,
      },
    }

export default {
  label: 'Bedankt!',
  form: {
    controls: {
      confirmation_message: {
        meta: {
          type: 'message',
          value: `Uw melding is bij ons bekend onder nummer: {incident.id_display}.
            \n Hebt u een e-mailadres ingevuld? Dan ontvangt u een e-mail met alle gegevens van uw melding.`,
          valueAuthenticated: `Uw melding is bij ons bekend onder nummer: [{incident.id_display}](/manage/incident/{incident.id}).
            \n Hebt u een e-mailadres ingevuld? Dan ontvangt u een e-mail met alle gegevens van uw melding.`,
        },
        render: FormComponents.PlainText,
      },
      handling_message: {
        meta: {
          title: 'Wat doen we met uw melding?',
          key: 'incident.handling_message',
        },
        render: FormComponents.HandlingMessage,
      },

      ...navigation,

      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
}
