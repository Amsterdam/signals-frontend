// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import memoize from 'lodash/memoize'
import some from 'lodash/some'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import {
  priorityList,
  typesList,
} from 'signals/incident-management/definitions'

import FormComponents from '../components/form'
import IncidentNavigation from '../components/IncidentNavigation'
import checkVisibility from '../services/checkVisibility'
import getStepControls from '../services/get-step-controls'

const priorityValuesList = priorityList.reduce(
  (acc, { key, value, info }) => ({ ...acc, [key]: { value, info } }),
  {}
)
const typesValuesList = typesList.reduce(
  (acc, { key, value, info }) => ({ ...acc, [key]: { value, info } }),
  {}
)
const selectableSources = (sources) =>
  sources.filter((source) => source.can_be_selected)
const reduceSources = (sources) =>
  sources.reduce(
    (acc, { value }) => [...acc, { [value]: value }],
    [{ '': 'Vul bron in' }]
  )

export const renderSources = () => {
  if (getIsAuthenticated()) {
    return FormComponents.SelectInput
  } else {
    return FormComponents.HiddenInput
  }
}

const getControls = memoize(
  (sources) => ({
    controls: {
      error: {
        meta: {},
        render: FormComponents.GlobalError,
      },
      info_text: {
        meta: {
          type: 'message',
          value: `step-1.description`,
        },
        render: FormComponents.PlainText,
      },
      source: {
        meta: {
          label: 'Hoe komt de melding binnen?',
          path: 'source',
          values: sources ? reduceSources(selectableSources(sources)) : [],
          name: 'source',
          value: configuration.featureFlags.appMode ? 'app' : 'online',
        },
        options: {
          validators: ['required'],
        },
        render: renderSources(),
      },
      description: {
        meta: {
          label: 'Waar gaat het om?',
          subtitle:
            'Typ geen persoonsgegevens in deze omschrijving. We vragen dit later in dit formulier aan u.',
          path: 'text',
          rows: 7,
          maxLength: 1000,
        },
        options: {
          validators: ['required', ['maxLength', 1000]],
        },
        render: FormComponents.DescriptionInputRenderer,
      },
      subcategory: {
        meta: {
          label: 'Subcategorie',
          path: 'subcategory',
        },
        options: {
          validators: ['required'],
        },
        render: FormComponents.CategorySelectRenderer,
      },
      priority: {
        meta: {
          label: 'Wat is de urgentie?',
          path: 'priority',
          values: priorityValuesList,
        },
        options: {
          validators: ['required'],
        },
        authenticated: true,
        render: FormComponents.RadioInputGroup,
      },
      type: {
        meta: {
          label: 'Type',
          path: 'type',
          values: typesValuesList,
        },
        authenticated: true,
        render: FormComponents.RadioInputGroup,
        options: {
          validators: ['required'],
        },
      },
      images_previews: {
        meta: {
          label: 'images_previews',
        },
      },
      images: {
        meta: {
          label: "Foto's toevoegen",
          subtitle: 'Voeg een foto toe om de situatie te verduidelijken',
          minFileSize: 30 * 2 ** 10, // 30 KiB.
          maxFileSize: 20 * 2 ** 20, // 20 MiB.
          allowedFileTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
          ],
          maxNumberOfFiles: 3,
        },
        render: FormComponents.FileInputRenderer,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
      help_text: {
        meta: {
          label: 'step-1.help_text',
          value: configuration.language.helpText,
          ignoreVisibility: true,
        },
        render: FormComponents.PlainText,
      },
    },
  }),
  () => ''
)

export default {
  label: 'step-1.title',
  getNextStep: (wizard, incident) => {
    if (
      !some(getStepControls(wizard.vulaan, incident), (control) => {
        if (control.meta && !control.meta.ignoreVisibility) {
          return checkVisibility(control, incident)
        }
        return false
      })
    ) {
      return 'incident/contact'
    }
    return false
  },
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  formFactory: (incident, sources) => getControls(sources),
}
