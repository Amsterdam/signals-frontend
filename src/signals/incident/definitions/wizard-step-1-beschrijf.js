// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import some from 'lodash/some'
import memoize from 'lodash/memoize'
import { Validators } from 'react-reactive-form'
import {
  priorityList,
  typesList,
} from 'signals/incident-management/definitions'
import IncidentNavigation from '../components/IncidentNavigation'
import FormComponents from '../components/form'
import checkVisibility from '../services/checkVisibility'
import getStepControls from '../services/get-step-controls'
import { createRequired } from '../services/custom-validators'

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

const getControls = memoize(
  (sources) => ({
    controls: {
      error: {
        render: FormComponents.GlobalError,
      },
      source: {
        meta: {
          label: 'Hoe komt de melding binnen?',
          path: 'source',
          values: sources ? reduceSources(selectableSources(sources)) : [],
        },
        options: {
          validators: [Validators.required],
        },
        authenticated: true,
        render: FormComponents.SelectInput,
      },
      location: {
        meta: {
          label: 'Waar is het?',
          subtitle:
            'Typ het dichtstbijzijnde adres of klik de locatie aan op de kaart',
          path: 'location',
        },
        options: {
          validators: [
            createRequired('Kies een locatie op de kaart of vul een adres in'),
          ],
        },
        render: FormComponents.MapInput,
      },
      description: {
        meta: {
          label: 'Waar gaat het om?',
          subtitle:
            'Typ geen persoonsgegevens in deze omschrijving, dit wordt apart gevraagd',
          path: 'text',
          rows: 7,
          maxLength: 1000,
        },
        options: {
          validators: [Validators.required, Validators.maxLength(1000)],
        },
        render: FormComponents.DescriptionInputRenderer,
      },
      subcategory: {
        meta: {
          label: 'Subcategorie',
          path: 'subcategory',
        },
        options: {
          validators: [Validators.required],
        },
        render: FormComponents.CategorySelectRenderer,
      },
      datetime: {
        meta: {
          label: 'Geef het tijdstip aan',
          values: {
            Nu: 'Nu',
            Eerder: 'Eerder',
          },
        },
        options: {
          validators: [Validators.required],
        },
        render: FormComponents.RadioInputGroup,
      },
      incident_date: {
        meta: {
          ifAllOf: {
            datetime: 'Eerder',
          },
        },
        render: FormComponents.DateTimeInput,
        strict: false,
      },
      incident_time_hours: {
        meta: {
          label: 'Incident time hours',
          readOnly: true,
        },
        render: FormComponents.HiddenInput,
      },
      incident_time_minutes: {
        meta: {
          label: 'Incident time minutes',
          readOnly: true,
        },
        render: FormComponents.HiddenInput,
      },
      priority: {
        meta: {
          label: 'Wat is de urgentie?',
          path: 'priority',
          values: priorityValuesList,
        },
        options: {
          validators: [Validators.required],
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
          validators: [Validators.required],
        },
      },
      images_previews: {
        meta: {
          label: 'images_previews',
        },
        render: FormComponents.HiddenInput,
      },
      images: {
        meta: {
          label: "Foto's toevoegen",
          subtitle: 'Voeg een foto toe om de situatie te verduidelijken',
          minFileSize: 30 * 2 ** 10, // 30 KiB.
          maxFileSize: 8 * 2 ** 20, // 8 MiB.
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
    },
  }),
  () => ''
)

export default {
  label: 'Beschrijf uw melding',
  getNextStep: (wizard, incident) => {
    if (
      !some(getStepControls(wizard.vulaan, incident), (control) => {
        if (control.meta && !control.meta.ignoreVisibility) {
          return checkVisibility(control, incident)
        }
        return false
      })
    ) {
      return 'incident/telefoon'
    }
    return false
  },
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  postponeSubmitWhenLoading: 'incidentContainer.loadingClassification',
  formFactory: (incident, sources) => getControls(sources),
}
