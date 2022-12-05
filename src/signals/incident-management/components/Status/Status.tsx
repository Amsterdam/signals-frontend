// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import styled from 'styled-components'

import type { StatusCode } from 'signals/incident-management/definitions/types'
import type { Theme } from 'types/theme'

import { isStatusEnd } from '../../definitions/statusList'

type StatusProps = {
  children: ReactNode
  statusCode: StatusCode
}

const StyledStatus = styled.span<{ statusCode?: StatusCode; theme: Theme }>`
  font-weight: 700;
  color: ${({ statusCode, theme }) =>
    statusCode && isStatusEnd(statusCode)
      ? theme.colors.support.valid
      : theme.colors.support.invalid};
`

const Status = ({ children, statusCode }: StatusProps) => (
  <StyledStatus statusCode={statusCode}>{children}</StyledStatus>
)

export default Status
