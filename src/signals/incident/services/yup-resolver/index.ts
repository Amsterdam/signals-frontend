// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam

import { yupResolver } from '@hookform/resolvers/yup'
import isObject from 'lodash/isObject'
import * as yup from 'yup'
import type { AnyObject } from 'yup/es/types'

type Controls = { [s: string]: unknown } | ArrayLike<unknown> | undefined

type Validators = Array<
  ((props: any) => { custom: any }) | string | number | Array<string | number>
>

/**
 * setupSchema is needed for yup resolver to create objects for
 * validating the incidents form's input fields.
 * @param controls These are all the questions;
 * their meta values and validation rules.
 */
export function setupSchema(controls: Controls) {
  const schema = controls
    ? Object.fromEntries(
        Object.entries(controls).reduce(
          (acc: Array<[string, any]>, [key, control]: [string, any]) => {
            let validators: Validators = control?.options?.validators
            validators = Array.isArray(validators) ? validators : [validators]

            if (!validators) return acc

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const validationField: AnyObject = yup.lazy((value) => {
              /**
               * For a predefined set of questions, we add a custom validation.
               */
              let field: AnyObject | undefined = hasCustomValidation(key, value)
              if (field) return field

              /**
               * For most fields, the value type is determined in runtime.
               */
              if (Array.isArray(value)) {
                field = yup.array()
              } else if (isObject(value)) {
                field = yup.object().shape({})
              } else {
                if (typeof value === 'string') {
                  field = yup.string()
                } else if (typeof value === 'number') {
                  field = yup.number()
                } else {
                  field = yup.mixed()
                }
                /**
                 * After we have the main type of an input field, we add
                 * validations like: email/phone/function/maxLength
                 */
                field = addValidators(validators, field)
              }
              field = addRequiredValidation(validators, field)

              return field
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

/**
 * This method returns a custom validator for a couple of questions.
 */
function hasCustomValidation(key: string, value: any) {
  if (key === 'locatie') {
    return yup.object().shape({
      location: yup.object({
        coordinates: yup.mixed().required(),
        address: yup.mixed(),
      }),
    })
  } else if (key === 'source' && isObject(value)) {
    return yup.object({
      id: yup.string().required(),
      label: yup.string().required(),
    })
  }
  // other custom question validation can be placed here
}

function addRequiredValidation(validators: Validators, validationField: any) {
  let field = validationField
  const formattedValidators = Array.isArray(validators)
    ? validators
    : [validators]
  formattedValidators.map((validator) => {
    if (validator === 'required') {
      field = field.required()
    } else {
      field = field.nullable()
    }
  })
  return field
}

function addValidators(validators: Validators, field: AnyObject) {
  let validationField = field
  if (validators) {
    validators.map((validator) => {
      if (validator === 'email') {
        validationField = validationField.email()
      }

      if (
        Array.isArray(validator) &&
        validator[0] === 'maxLength' &&
        validationField.max
      ) {
        validationField = validationField.max(validator[1], validator[1])
      } else if (typeof validator === 'function') {
        validationField = validationField.test(
          'custom',
          (v: any) => validator({ value: v })?.custom,
          (v: any) => !validator({ value: v })?.custom
        )
      }
    })
  }
  return validationField
}

export default function (controls: Controls) {
  return yupResolver(setupSchema(controls))
}
