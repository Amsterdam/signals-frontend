// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import type { FC } from 'react'

interface HiddenInputProps {
  name: string
  value: string
}

export const HiddenInput: FC<HiddenInputProps> = ({ name, value }) => (
  <div className="hidden-input">
    <input id={`form${name}`} type="hidden" value={value} />
  </div>
)

export default HiddenInput
