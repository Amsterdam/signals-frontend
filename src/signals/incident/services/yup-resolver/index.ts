import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import type { AnyObject } from 'yup/es/types'

type Controls = { [s: string]: unknown } | ArrayLike<unknown> | undefined

export function setUpSchema(controls: Controls) {
  const schema = controls
    ? Object.fromEntries(
        Object.entries(controls).reduce(
          (acc: Array<[string, any]>, [key, control]: [string, any]) => {
            const validators: any = control?.options?.validators

            let validationField: AnyObject = yup.string()
            if (
              ['locatie', 'location', 'priority', 'type'].includes(key) ||
              (key.startsWith('extra') &&
                Object.keys(control.meta?.values || {})?.length > 0) ||
              (key.startsWith('extra') && control.meta?.endpoint)
            ) {
              validationField = yup.object().shape({})
            }
            if (key === 'source') {
              validationField = yup.string()
            }
            /**
              Chain multiple validators per field. For max, add the
              validator value as message as the second argument.
              */
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
              acc.push([key, validationField])
            }
            return acc
          },
          []
        )
      )
    : {}

  return yup.object(schema)
}

export default function (controls: Controls) {
  return yupResolver(setUpSchema(controls))
}
