// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import memoize from 'lodash/memoize'

import configuration from 'shared/services/configuration/configuration'

import afval from './wizard-step-2-vulaan/afval'
import afvalContainer from './wizard-step-2-vulaan/afval-container'
import boomIllegaleKap from './wizard-step-2-vulaan/boom-illegale-kap'
import bouwSloopOverlast from './wizard-step-2-vulaan/bouw-sloop-overlast'
import civieleConstructies from './wizard-step-2-vulaan/civieleConstructies'
import eikenprocessierups from './wizard-step-2-vulaan/eikenprocessierups'
import locatie from './wizard-step-2-vulaan/locatie'
import overlastBedrijvenEnHoreca from './wizard-step-2-vulaan/overlast-bedrijven-en-horeca'
import overlastInDeOpenbareRuimte from './wizard-step-2-vulaan/overlast-in-de-openbare-ruimte'
import overlastOpHetWater from './wizard-step-2-vulaan/overlast-op-het-water'
import overlastVanDieren from './wizard-step-2-vulaan/overlast-van-dieren'
import overlastPersonenEnGroepen from './wizard-step-2-vulaan/overlast-van-en-door-personen-of-groepen'
import straatverlichtingKlokken from './wizard-step-2-vulaan/straatverlichting-klokken'
import wegenVerkeerStraatmeubilair from './wizard-step-2-vulaan/wegen-verkeer-straatmeubilair'
import wonen from './wizard-step-2-vulaan/wonen'
import FormComponents from '../components/form'
import IncidentNavigation from '../components/IncidentNavigation'

const mapFieldNameToComponent = (key) => FormComponents[key]

/**
 * Options.validators contains only strings, which are mapped to some yup method.
 */
// const mapValidatorToFn = (validator) => Validators?.[validator] || validator
const mapValidatorToFn = (validator) => validator

const expandValidatorFn = ([validator, ...args]) =>
  mapValidatorToFn(validator)(...args)

const expandValidator = (validator) =>
  Array.isArray(validator)
    ? expandValidatorFn(validator)
    : mapValidatorToFn(validator)

const expandQuestions = memoize(
  (questions) => ({
    controls: {
      error: {
        meta: {
          ignoreVisibility: true,
        },
        render: FormComponents.GlobalError,
      },
      ...Object.entries(questions).reduce(
        (acc, [key, question]) => ({
          ...acc,
          [key]: {
            ...question,
            options: {
              validators: (question.options?.validators || []).map(
                expandValidator
              ),
            },
            render: mapFieldNameToComponent(question.render),
          },
        }),
        {}
      ),
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
  }),
  (questions, category, subcategory) => `${category}${subcategory}`
)

const fallback = expandQuestions({ locatie })

export default {
  label: 'step-2.title',
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  formFactory: ({ category, subcategory, questions }) => {
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
          return expandQuestions(afvalContainer, category, subcategory)
        }
        return expandQuestions(afval, category, subcategory)
      }

      case 'openbaar-groen-en-water': {
        if (subcategory === 'eikenprocessierups') {
          return expandQuestions(eikenprocessierups, category, subcategory)
        } else if (subcategory === 'boom-illegale-kap') {
          return expandQuestions(boomIllegaleKap, category, subcategory)
        } else {
          return fallback
        }
      }

      case 'civiele-constructies':
        return expandQuestions(civieleConstructies, category, subcategory)

      case 'overlast-bedrijven-en-horeca':
        return expandQuestions(overlastBedrijvenEnHoreca, category, subcategory)

      case 'overlast-in-de-openbare-ruimte': {
        if (subcategory === 'bouw-sloopoverlast') {
          return expandQuestions(bouwSloopOverlast, category, subcategory)
        }

        return expandQuestions(
          overlastInDeOpenbareRuimte,
          category,
          subcategory
        )
      }

      case 'overlast-op-het-water':
        return expandQuestions(overlastOpHetWater, category, subcategory)

      case 'overlast-van-dieren':
        return expandQuestions(overlastVanDieren, category, subcategory)

      case 'overlast-van-en-door-personen-of-groepen':
        return expandQuestions(overlastPersonenEnGroepen, category, subcategory)

      case 'wegen-verkeer-straatmeubilair': {
        const config = ['klok', 'lantaarnpaal-straatverlichting'].includes(
          subcategory
        )
          ? straatverlichtingKlokken
          : wegenVerkeerStraatmeubilair

        return expandQuestions(config, category, subcategory)
      }

      case 'wonen':
        return expandQuestions(wonen, category, subcategory)

      default:
        return fallback
    }
  },
}
