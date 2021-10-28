import styled from 'styled-components'

import type { ReactNode, FC } from 'react'
import type { StatusCode } from 'signals/incident-management/definitions/types'
import type { Theme } from 'types/theme'

import { isStatusEnd } from '../../definitions/statusList'

type StatusProps = {
  children?: ReactNode
  statusCode: StatusCode
}

const StyledStatus = styled.span<{ statusCode?: StatusCode; theme: Theme }>`
  color: ${({ statusCode, theme }) =>
    statusCode && isStatusEnd(statusCode)
      ? theme.colors.support.valid
      : theme.colors.support.invalid};
`

const Status: FC<StatusProps> = ({ children, statusCode }) => (
  <StyledStatus statusCode={statusCode}>{children}</StyledStatus>
)

export default Status
