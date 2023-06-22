// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { RefObject } from 'react'

import { isObject } from 'lodash'

export function scrollToInvalidElement(
  controls: any,
  errors: any,
  formRef: RefObject<HTMLDivElement>
) {
  const invalidControl: any = Object.values(controls).find((control: any) => {
    return Object.keys(errors || {}).includes(control?.meta?.name)
  })

  if (!invalidControl) {
    return
  }

  const { name, values } = invalidControl.meta
  const valueSelector =
    !Array.isArray(values) && isObject(values)
      ? `-${Object.keys(values)[0]}`
      : ''

  if (formRef.current) {
    const invalidElement: any = formRef?.current.querySelector(
      `#${name}${valueSelector}`
    )

    invalidElement?.scrollIntoView({ behaviour: 'smooth' })
  }
}
