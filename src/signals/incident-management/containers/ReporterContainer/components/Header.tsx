// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import BackLink from 'components/BackLink'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'

const StyledHeading = styled(Heading)`
  padding-top: ${themeSpacing(6)};
`

interface HeaderProps {
  id: string
  count: number
  email: string
  className?: string
}

const Header: FunctionComponent<HeaderProps> = ({
  id,
  count,
  email,
  className,
}) => (
  <div className={className}>
    <BackLink to={`${INCIDENT_URL}/${id}`}>Terug naar melding</BackLink>
    <StyledHeading forwardedAs="h1">
      Meldingen van {email} ({count})
    </StyledHeading>
  </div>
)

export default Header
