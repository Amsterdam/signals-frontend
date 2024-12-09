// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { BaseSyntheticEvent, ReactNode } from 'react'

import styled from 'styled-components'

import Button from 'components/Button'

const StyledButton = styled(Button)<{ $appMode?: boolean }>`
  ${({ $appMode }) => !$appMode && 'margin-right: 15px !important'};
`

interface Props {
  appMode?: boolean
  children: ReactNode
  onClick: (event: BaseSyntheticEvent) => void
}

const NextButton = ({ appMode, children, onClick, ...restProps }: Props) => (
  <StyledButton
    {...restProps}
    $appMode={appMode}
    onClick={onClick}
    taskflow={!appMode}
    type="submit"
    variant={appMode ? 'primary' : 'secondary'}
  >
    {children}
  </StyledButton>
)

export default NextButton
