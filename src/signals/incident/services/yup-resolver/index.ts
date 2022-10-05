// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam

import { yupResolver } from '@hookform/resolvers/yup'
import isObject from 'lodash/isObject'
import * as yup from 'yup'
import type { AnyObject } from 'yup/es/types'

type Controls = { [s: string]: unknown } | ArrayLike<unknown> | undefined

export function setUpSchema(controls: Controls) {
  const schema = controls
    ? Object.fromEntries(
        Object.entries(controls).reduce(
          (acc: Array<[string, any]>, [key, control]: [string, any]) => {
            const validators: any = control?.options?.validators

            /**
             * Here all the unknown fields, coming from the backend when
             * showVulaanControls flag is true, are validated on their top
             * level types.
             */
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const validationField = yup.lazy((obj) => {
              let validatorForField
              if (
                ['locatie', 'location', 'priority', 'type'].includes(key) ||
                ((key.startsWith('extra') || key === 'source') &&
                  Object.keys(control.meta?.values || {})?.length > 0) ||
                (key.startsWith('extra') && control.meta?.endpoint)
              ) {
                validatorForField = yup.object().shape({})

                if (key === 'locatie') {
                  return yup.object().shape({
                    location: yup.object({
                      coordinates: yup.mixed().required(),
                      address: yup.mixed(),
                    }),
                  })
                }
              } else if (isObject(obj)) {
                validatorForField = yup.object().shape({})
              } else if (typeof obj === 'string') {
                validatorForField = yup.string()
              } else {
                validatorForField = yup.mixed()
              }

              return addValidators(validators, validatorForField)
            })
            acc.push([key, validationField])

            return acc
          },
          []
        )
      )
    : {}

  return yup.object(schema)
}

function addValidators(validators: any, validationField: AnyObject) {
  if (validators) {
    ;(Array.isArray(validators) ? validators : [validators]).map(
      (validator) => {
        if (validator === 'required') {
          validationField = validationField.required()
        } else {
          validationField = validationField.nullable()
        }

        if (validator === 'email') {
          validationField = validationField.email()
        }

        if (Number.parseInt(validator)) {
          validationField = validationField.max(
            Number.parseInt(validator),
            validator
          )
        }

        if (
          Array.isArray(validator) &&
          validator[0] === 'maxLength' &&
          Number.parseInt(validator[1])
        ) {
          validationField = validationField.max(
            Number.parseInt(validator[1]),
            validator[1]
          )
        } else if (typeof validator === 'function') {
          validationField = validationField.test(
            'custom',
            (v: any) => validator({ value: v })?.custom,
            (v: any) => !validator({ value: v })?.custom
          )
        }
      }
    )
  }
  return validationField
}

export default function (controls: Controls) {
  return yupResolver(setUpSchema(controls))
}
