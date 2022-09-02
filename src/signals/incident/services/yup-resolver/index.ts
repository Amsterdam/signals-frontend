import type { AnyObject } from 'yup/es/types'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export default function constructYupResolver(
  controls: { [s: string]: unknown } | ArrayLike<unknown> | undefined
) {
  const schema = controls
    ? Object.fromEntries(
        Object.entries(controls).reduce(
          (acc: Array<[string, any]>, [key, control]: [string, any]) => {
            const validators: any = control?.options?.validators

            let validationField: AnyObject = yup.string()
            if (
              key === 'locatie' ||
              key === 'location' ||
              (key.startsWith('extra') &&
                Object.keys(control.meta?.values || {})?.length > 0) ||
              (key.startsWith('extra') && control.meta?.endpoint)
            ) {
              validationField = yup.object()
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
  return yupResolver(yup.object(schema))
}
