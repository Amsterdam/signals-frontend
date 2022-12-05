// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const Bar = styled.div`
  & > * + * {
    margin-left: ${themeSpacing(2)};
  }
`

export interface ButtonBarProps {
  className?: string
  children: ReactNode
}

/**
 * Button container that merely adds margin between children
 */
const ButtonBar = ({ className, children }: ButtonBarProps) => (
  <Bar className={className}>{children}</Bar>
)

export default ButtonBar
