// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import memoize from 'lodash/memoize'

import configuration from 'shared/services/configuration/configuration'

import { QuestionFieldType } from 'types/question'
import IncidentNavigation from '../components/IncidentNavigation'
import PreviewComponents from '../components/IncidentPreview/components'
import { controls as wonenControls } from './wizard-step-2-vulaan/wonen'
import afvalContainerControls from './wizard-step-2-vulaan/afval-container'
import afvalControls from './wizard-step-2-vulaan/afval'
import civieleConstructies from './wizard-step-2-vulaan/civieleConstructies'
import openbaarGroenEnWaterControls from './wizard-step-2-vulaan/openbaarGroenEnWater'
import overlastBedrijvenEnHorecaControls from './wizard-step-2-vulaan/overlast-bedrijven-en-horeca'
import overlastInDeOpenbareRuimteControls from './wizard-step-2-vulaan/overlast-in-de-openbare-ruimte'
import overlastOpHetWaterControls from './wizard-step-2-vulaan/overlast-op-het-water'
import overlastPersonenEnGroepenControls from './wizard-step-2-vulaan/overlast-van-en-door-personen-of-groepen'
import overlastVanDieren from './wizard-step-2-vulaan/overlast-van-dieren'
import straatverlichtingKlokkenControls from './wizard-step-2-vulaan/straatverlichting-klokken'
import wegenVerkeerStraatmeubilairControls from './wizard-step-2-vulaan/wegen-verkeer-straatmeubilair'
import locatie from './wizard-step-2-vulaan/locatie'

export const ObjectLabel = ({ value }) => value?.label
export const Label = ({ value }) => value
export const SCSVLabel = ({ value }) => value.filter(Boolean).join('; ')
export const Null = () => null

export const renderPreview = ({ render, meta }) => {
  switch (render) {
    case QuestionFieldType.RadioInput:
    case QuestionFieldType.SelectInput:
      return ObjectLabel

    case QuestionFieldType.CheckboxInput:
      if (meta?.values) {
        return PreviewComponents.ListObjectValue
      }

      return () => 'Ja'

    case QuestionFieldType.MultiTextInput:
      return SCSVLabel

    case QuestionFieldType.AssetSelect:
    case QuestionFieldType.CaterpillarSelect:
    case QuestionFieldType.ClockSelect:
    case QuestionFieldType.StreetlightSelect:
      return (props) => (
        <>
          {PreviewComponents.MapPreview({
            ...props,
            featureTypes: meta.featureTypes,
          })}
          {PreviewComponents.AssetListPreview({
            ...props,
            featureTypes: meta.featureTypes,
          })}
        </>
      )

    case QuestionFieldType.TextInput:
    case QuestionFieldType.TextareaInput:
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
          render: renderPreview(question),
        },
      }),
      {}
    ),
  (questions, category, subcategory) => `${category}${subcategory}`
)

const fallback = summary({ locatie })

const getExtraQuestions = (category, subcategory, questions) => {
  if (configuration?.featureFlags.showVulaanControls === false) {
    return fallback
  }

  if (configuration.featureFlags.fetchQuestionsFromBackend) {
    const backendQuestions = questions || {}
    const hasQuestions = Object.keys(backendQuestions).length > 0
    return hasQuestions
      ? expandQuestions(backendQuestions, category, subcategory)
      : fallback
  }

  switch (category) {
    case 'afval': {
      if (subcategory.startsWith('container')) {
        return summary(afvalContainerControls)
      } else {
        return summary(afvalControls)
      }
    }

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

    case 'wegen-verkeer-straatmeubilair': {
      const config = ['klok', 'lantaarnpaal-straatverlichting'].includes(
        subcategory
      )
        ? straatverlichtingKlokkenControls
        : wegenVerkeerStraatmeubilairControls

      return summary(config)
    }

    case 'wonen':
      return summary(wonenControls)

    case 'openbaar-groen-en-water': {
      if (subcategory === 'eikenprocessierups') {
        return summary(openbaarGroenEnWaterControls)
      } else {
        return fallback
      }
    }

    default:
      return fallback
  }
}

export default {
  label: 'Versturen',
  subHeader: 'Controleer uw gegevens en verstuur uw melding.',
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
      vulaan: 'Wijzig locatie en vragen',
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
      description: {
        label: 'Waar gaat het over?',
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
