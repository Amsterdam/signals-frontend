// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { FIELD_TYPE_MAP, INPUT_VALIDATOR_MAP } from './constants'

const mapValidatorWithArgs = ([key, ...args]) => [
  INPUT_VALIDATOR_MAP[key],
  ...args,
]
const mapValidator = (key) =>
  Array.isArray(key) ? mapValidatorWithArgs(key) : INPUT_VALIDATOR_MAP[key]

export const resolveQuestions = (questions) =>
  questions.reduce(
    (acc, question) => ({
      ...acc,
      [question.key]: {
        meta:
          question.meta.saveQuestion === false
            ? question.meta
            : {
                ...question.meta,
                pathMerge: 'extra_properties',
              },
        options: {
          validators: [
            ...new Set([
              ...(question.meta?.validators || []),
              ...(question.required ? ['required'] : []),
            ]),
          ].map(mapValidator),
        },
        render: FIELD_TYPE_MAP[question.field_type],
      },
    }),
    {}
  )

export const getIncidentClassification = (state, incidentPart) => {
  const previousClassification = state.incident.classification
  const classificationPrediction = state.classificationPrediction
  const canChange =
    classificationPrediction === null ||
    previousClassification === null ||
    previousClassification?.slug === classificationPrediction?.slug
  return canChange ? incidentPart : {}
}
