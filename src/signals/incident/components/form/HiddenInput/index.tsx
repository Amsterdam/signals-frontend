// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { useEffect } from 'react'

import type { ReactiveFormMeta, FormOptions } from 'types/reactive-form'

import type { Parent } from '../types/FileInput'
import type { HiddenInputMeta } from '../types/HiddenInput'

export interface Props {
  getError: ReactiveFormMeta['getError']
  hasError: ReactiveFormMeta['hasError']
  handler: ReactiveFormMeta['handler']
  validatorOrOpts: FormOptions
  meta: HiddenInputMeta
  parent: Parent
}

const HiddenInput = (props: Props) => {
  const { parent, meta, handler } = props

  useEffect(() => {
    parent.meta.updateIncident({
      [meta.name]: meta.value,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!meta.name || !meta.value) return null
  return (
    <input
      data-testid="hidden-input"
      type="hidden"
      id={meta.name}
      value={meta.value}
      {...handler}
    />
  )
}

export default HiddenInput
