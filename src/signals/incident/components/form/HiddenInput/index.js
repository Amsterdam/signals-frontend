// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { useEffect } from 'react'

const HiddenInput = (props) => {
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
