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

            if (!validators) return acc
            /**
             * Here all the unknown fields, coming from the backend when
             * showVulaanControls flag is true, are validated on their top
             * level types.
             */
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const validationField = yup.lazy((obj) => {
              let validatorForField
              if (key === 'locatie') {
                return yup.object().shape({
                  location: yup.object({
                    coordinates: yup.mixed().required(),
                    address: yup.mixed(),
                  }),
                })
              } else if (Array.isArray(obj)) {
                validatorForField = yup.array()
              } else if (isObject(obj)) {
                validatorForField = yup.object().shape({})
              } else if (typeof obj === 'string') {
                validatorForField = yup.string()
              } else if (typeof obj === 'number') {
                validatorForField = yup.number()
              } else {
                validatorForField = yup.mixed()
              }

              validatorForField = addValidators(validators, validatorForField)

              return validatorForField
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

function addValidators(validators: any, field: AnyObject) {
  let validationField = field
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

        if (
          Array.isArray(validator) &&
          validator[0] === 'maxLength' &&
          Number.parseInt(validator[1]) &&
          validationField.max
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
