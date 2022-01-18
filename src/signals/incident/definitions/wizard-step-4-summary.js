// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import memoize from 'lodash/memoize'

import configuration from 'shared/services/configuration/configuration'
import { FIELD_TYPE_MAP } from 'signals/incident/containers/IncidentContainer/constants'

import IncidentNavigation from '../components/IncidentNavigation'
import PreviewComponents from '../components/IncidentPreview/components'
import { controls as wonenControls } from './wizard-step-2-vulaan/wonen'
import overlastBedrijvenEnHorecaControls from './wizard-step-2-vulaan/overlast-bedrijven-en-horeca'
import overlastInDeOpenbareRuimteControls from './wizard-step-2-vulaan/overlast-in-de-openbare-ruimte'
import overlastOpHetWaterControls from './wizard-step-2-vulaan/overlast-op-het-water'
import wegenVerkeerStraatmeubilairControls from './wizard-step-2-vulaan/wegen-verkeer-straatmeubilair'
import afvalControls from './wizard-step-2-vulaan/afval'
import overlastPersonenEnGroepenControls from './wizard-step-2-vulaan/overlast-van-en-door-personen-of-groepen'
import civieleConstructies from './wizard-step-2-vulaan/civieleConstructies'
import openbaarGroenEnWaterControls from './wizard-step-2-vulaan/openbaarGroenEnWater'
import overlastVanDieren from './wizard-step-2-vulaan/overlast-van-dieren'

export const ObjectLabel = ({ value }) => value?.label
export const Label = ({ value }) => value
export const SCSVLabel = ({ value }) => value.filter(Boolean).join('; ')
export const Null = () => null

export const renderPreview = ({ render, meta }) => {
  switch (render) {
    case FIELD_TYPE_MAP.radio_input:
    case FIELD_TYPE_MAP.select_input:
      return ObjectLabel

    case FIELD_TYPE_MAP.checkbox_input:
      if (meta?.values) {
        return PreviewComponents.ListObjectValue
      }

      return () => 'Ja'

    case FIELD_TYPE_MAP.multi_text_input:
      return SCSVLabel

    case FIELD_TYPE_MAP.map_select:
      return (props) => PreviewComponents.MapSelectPreview({ ...props, meta })

    case FIELD_TYPE_MAP.asset_select:
    case FIELD_TYPE_MAP.caterpillar_select:
    case FIELD_TYPE_MAP.clock_select:
    case FIELD_TYPE_MAP.streetlight_select:
      return (props) =>
        PreviewComponents.AssetListPreview({
          ...props,
          featureTypes: meta.featureTypes,
        })

    case FIELD_TYPE_MAP.text_input:
    case FIELD_TYPE_MAP.textarea_input:
      return Label

    default:
      return Null
  }
}

export const summary = (controls) =>
  Object.entries(controls).reduce(
    (acc, [key, val]) => ({
      ...acc,
      [key]: {
        label: val.meta.label || val.meta.shortLabel,
        optional: true,
        render: renderPreview(val),
      },
    }),
    {}
  )

const expandQuestions = memoize(
  (questions) =>
    Object.entries(questions).reduce(
      (acc, [key, question]) => ({
        ...acc,
        [key]: {
          label: question.meta.label || question.meta.shortLabel,
          optional: !question.required,
          render: renderPreview({
            render: question.render,
            meta: question.meta,
          }),
        },
      }),
      {}
    ),
  (questions, category, subcategory) => `${category}${subcategory}`
)

const getExtraQuestions = (category, subcategory, questions) => {
  if (!configuration?.featureFlags.showVulaanControls) return {}

  if (configuration.featureFlags.fetchQuestionsFromBackend) {
    return expandQuestions(questions || {}, category, subcategory)
  }

  switch (category) {
    case 'afval':
      return summary(afvalControls)

    case 'civiele-constructies':
      return summary(civieleConstructies)

    case 'overlast-bedrijven-en-horeca':
      return summary(overlastBedrijvenEnHorecaControls)

    case 'overlast-in-de-openbare-ruimte':
      return summary(overlastInDeOpenbareRuimteControls)

    case 'overlast-op-het-water':
      return summary(overlastOpHetWaterControls)

    case 'overlast-van-en-door-personen-of-groepen':
      return summary(overlastPersonenEnGroepenControls)

    case 'overlast-van-dieren':
      return summary(overlastVanDieren)

    case 'wegen-verkeer-straatmeubilair':
      return summary(wegenVerkeerStraatmeubilairControls)

    case 'wonen':
      return summary(wonenControls)

    case 'openbaar-groen-en-water':
      return summary(openbaarGroenEnWaterControls)

    default:
      return {}
  }
}

export default {
  label: 'Versturen',
  subheader: 'Maak een aanpassing als dat nodig is.',
  nextButtonLabel: 'Verstuur',
  nextButtonClass: 'action primary',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  sectionLabels: {
    heading: {
      beschrijf: '1. Beschrijf uw melding',
      vulaan: '2. Locatie en vragen',
      contact: '3. Contactgegevens',
    },
    edit: {
      beschrijf: 'Wijzig uw melding',
      vulaan: 'Wijzig aanvullende informatie',
      contact: 'Wijzig contactgegevens',
    },
  },
  formAction: 'CREATE_INCIDENT',
  form: {
    controls: {
      page_summary: {},
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
  previewFactory: ({ category, subcategory, questions }) => ({
    beschrijf: {
      source: {
        label: 'Bron',
        render: ({ value }) => value?.label,
        authenticated: true,
      },
      priority: {
        label: 'Urgentie',
        render: ({ value }) => value?.label,
        authenticated: true,
      },
      location: {
        label: 'Waar is het?',
        render: PreviewComponents.MapPreview,
      },
      description: {
        label: 'Uw melding gaat over:',
        render: ({ value }) => value,
      },
      classification: {
        label: 'Subcategorie',
        render: ({ value }) => value?.name,
        authenticated: true,
      },
      datetime: {
        label: 'Geef het tijdstip aan',
        render: PreviewComponents.DateTime,
      },
      images_previews: {
        label: "Foto's toevoegen",
        render: PreviewComponents.Image,
        optional: true,
      },
    },

    vulaan: getExtraQuestions(category, subcategory, questions),

    contact: {
      phone: {
        label: 'Wat is uw telefoonnummer?',
        optional: true,
        render: ({ value }) => value,
      },

      email: {
        label: 'Wat is uw e-mailadres?',
        optional: true,
        render: ({ value }) => value,
      },

      sharing_allowed: {
        label: 'Melding delen',
        optional: true,
        render: ({ value }) => {
          if (!value) return null

          const { label, value: sharingIsAllowed } = value

          return sharingIsAllowed ? label : null
        },
      },
    },
  }),
}
