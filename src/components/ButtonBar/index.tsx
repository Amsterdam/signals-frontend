// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  & > * + * {
    margin-left: ${themeSpacing(2)};
  }
`

export interface ButtonBarProps {
  className?: string
}

/**
 * Button container that merely adds margin between children
 */
const ButtonBar: FunctionComponent<ButtonBarProps> = ({
  className,
  children,
}) => <Bar className={className}>{children}</Bar>

export default ButtonBar
