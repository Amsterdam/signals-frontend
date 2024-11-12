// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { BaseSyntheticEvent, ReactNode } from 'react'

import styled from 'styled-components'

import Button from 'components/Button'

import configuration from '../../shared/services/configuration/configuration'

const appMode = configuration.featureFlags.appMode

const StyledButton = styled(Button)`
  margin-right: ${appMode ? '0' : '15px !important'};
  width: ${appMode ? '100%' : 'auto'};
`

interface Props {
  className?: string
  children: ReactNode
  onClick: (event: BaseSyntheticEvent) => void
}

const NextButton = ({ className = '', children, onClick }: Props) => (
  <StyledButton
    className={className}
    data-testid="next-button"
    onClick={onClick}
    type="submit"
    taskflow={!appMode}
    variant={appMode ? 'primary' : 'secondary'}
  >
    {children}
  </StyledButton>
)

export default NextButton
