// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import memoize from 'lodash/memoize'

import Summary from 'components/Summary'
import configuration from 'shared/services/configuration/configuration'
import { QuestionFieldType } from 'types/question'

import afvalControls from './wizard-step-2-vulaan/afval'
import afvalAEGControls from './wizard-step-2-vulaan/afval-aeg'
import afvalContainerControls from './wizard-step-2-vulaan/afval-container'
import afvalRolcontainerControls from './wizard-step-2-vulaan/afval-rolcontainer'
import afvalThorControls from './wizard-step-2-vulaan/afval-thor'
import bomenControls from './wizard-step-2-vulaan/bomen'
import boomIllegaleKap from './wizard-step-2-vulaan/boom-illegale-kap'
import bouwSloopOverlast from './wizard-step-2-vulaan/bouw-sloop-overlast'
import civieleConstructies from './wizard-step-2-vulaan/civieleConstructies'
import eikenprocessierupsControls from './wizard-step-2-vulaan/eikenprocessierups'
import japanseDuizendknoop from './wizard-step-2-vulaan/japanse-duizendknoop'
import locatie from './wizard-step-2-vulaan/locatie'
import overlastBedrijvenEnHorecaControls from './wizard-step-2-vulaan/overlast-bedrijven-en-horeca'
import overlastInDeOpenbareRuimteControls from './wizard-step-2-vulaan/overlast-in-de-openbare-ruimte'
import overlastOpHetWaterControls from './wizard-step-2-vulaan/overlast-op-het-water'
import overlastOpHetWaterThorControls from './wizard-step-2-vulaan/overlast-op-het-water-thor'
import overlastVanDieren from './wizard-step-2-vulaan/overlast-van-dieren'
import overlastPersonenEnGroepenControls from './wizard-step-2-vulaan/overlast-van-en-door-personen-of-groepen'
import straatverlichtingKlokkenControls from './wizard-step-2-vulaan/straatverlichting-klokken'
import verkeersoverlastControls from './wizard-step-2-vulaan/verkeersoverlast'
import wegenVerkeerStraatmeubilairControls from './wizard-step-2-vulaan/wegen-verkeer-straatmeubilair'
import { controls as wonenControls } from './wizard-step-2-vulaan/wonen'
import IncidentNavigation from '../components/IncidentNavigation'
import PreviewComponents from '../components/IncidentPreview/components'

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

    case QuestionFieldType.LocationSelect:
    case QuestionFieldType.AssetSelect:
    case QuestionFieldType.CaterpillarSelect:
    case QuestionFieldType.ClockSelect:
    case QuestionFieldType.StreetlightSelect:
      return (props) => (
        <>
          {Summary({
            address: props.incident.location?.address,
            coordinates: props.incident.location.coordinates,
            selection: props.value.selection,
            featureTypes: meta.featureTypes,
          })}
        </>
      )

    case QuestionFieldType.TextInput:
    case QuestionFieldType.TextareaInput:
      return Label

    case QuestionFieldType.DateTimeInput:
      return PreviewComponents.DateTime

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
        canBeNull: val.meta?.canBeNull ?? false,
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
      }
      if (['asbest-accu', 'handhaving-op-afval'].includes(subcategory)) {
        return summary(afvalThorControls)
      }
      if (
        ['rolcontainer-is-kapot', 'rolcontainer-is-vol'].includes(subcategory)
      ) {
        return summary(afvalRolcontainerControls)
      }
      if (
        [
          'grofvuil',
          'huisafval',
          'puin-sloopafval',
          'bruin-en-witgoed',
          'kerstbomen',
          'overig-afval',
        ].includes(subcategory)
      ) {
        return summary(afvalAEGControls)
      }

      return summary(afvalControls)
    }

    case 'civiele-constructies':
      return summary(civieleConstructies)

    case 'overlast-bedrijven-en-horeca':
      return summary(overlastBedrijvenEnHorecaControls)

    case 'overlast-in-de-openbare-ruimte': {
      if (subcategory === 'bouw-sloopoverlast') {
        return expandQuestions(bouwSloopOverlast, category, subcategory)
      }

      return summary(overlastInDeOpenbareRuimteControls)
    }

    case 'overlast-op-het-water':
      if (
        [
          'blokkade-van-de-vaarweg',
          'overig-boten',
          'overlast-op-het-water-geluid',
          'overlast-op-het-water-snel-varen',
          'scheepvaart-nautisch-toezicht',
        ].includes(subcategory)
      ) {
        return summary(overlastOpHetWaterThorControls)
      }

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

      if (subcategory === 'verkeersoverlast') {
        return summary(verkeersoverlastControls)
      }

      return summary(config)
    }

    case 'wonen':
      return summary(wonenControls)

    case 'openbaar-groen-en-water': {
      if (
        subcategory === 'boom' ||
        subcategory === 'boom-noodkap' ||
        subcategory === 'boom-illegale-kap' ||
        subcategory === 'boom-aanvraag-plaatsing' ||
        subcategory === 'boom-overig' ||
        subcategory === 'boom-afval' ||
        subcategory === 'boom-stormschade' ||
        subcategory === 'boom-verzoek-inspectie' ||
        subcategory === 'boomziekten-en-plagen'
      ) {
        return summary(bomenControls)
      }
      if (subcategory === 'eikenprocessierups') {
        return summary(eikenprocessierupsControls)
      } else if (subcategory === 'japanse-duizendknoop') {
        return summary(japanseDuizendknoop)
      } else if (subcategory === 'boom-illegale-kap') {
        return summary(boomIllegaleKap)
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
