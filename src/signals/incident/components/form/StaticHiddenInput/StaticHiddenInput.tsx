// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

export interface StaticHiddenInputProps {
  meta: {
    name: string
    value: string
    updateIncident: (data: { [key: string]: [value: string] }) => void
  }
  parent: any
}

const StaticHiddenInput: FunctionComponent<StaticHiddenInputProps> = ({
  meta,
  parent,
}) => {
  setTimeout(
    () =>
      parent.meta.updateIncident({
        [meta.name]: meta.value,
      }),
    0
  )

  return <input type="hidden" id={meta.name} value={meta.value} />
}

export default StaticHiddenInput
