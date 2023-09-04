// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam

/**
 * Deprecated note:
 * This component should be removed when DefaultTextAdmin is removed and all municipalities are using StandardTextAdmin.
 */

import type { FC } from 'react'

interface HiddenInputProps {
  name: string
  value: string
}

/**
 * @deprecated
 */
export const HiddenInput: FC<HiddenInputProps> = ({ name, value }) => (
  <div className="hidden-input">
    <input id={`form${name}`} type="hidden" value={value} />
  </div>
)

export default HiddenInput
