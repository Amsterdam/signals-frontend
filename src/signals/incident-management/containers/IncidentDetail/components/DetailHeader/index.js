// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { themeColor, themeSpacing, Heading, styles } from '@amsterdam/asc-ui'

import BackLink from 'components/BackLink'
import Button from 'components/Button'
import configuration from 'shared/services/configuration/configuration'
import {
  MAP_URL,
  INCIDENT_URL,
  INCIDENTS_URL,
} from 'signals/incident-management/routes'

import { PATCH_TYPE_THOR } from '../../constants'
import IncidentDetailContext from '../../context'
import DownloadButton from './components/DownloadButton'

const Header = styled.header`
  display: grid;
  padding: ${themeSpacing(2, 0)};
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    column-gap: ${({ theme }) => theme.layouts.medium.gutter}px;
    grid-template-columns: 7fr 4fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    grid-template-columns: 7fr 1fr 4fr;
  }
`

const BackLinkContainer = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
`

const StyledBackLink = styled(BackLink)`
  margin: ${themeSpacing(4)} 0;
`

const ButtonContainer = styled.div`
  grid-column-start: 3;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > * {
    margin-left: ${themeSpacing(2)};
  }
`

const HeadingContainer = styled.div`
  display: flex;

  && > * {
    margin: 0;
  }

  & > ${styles.HeaderStyles} {
    font-weight: 400;
  }
`

const StyledHeading = styled(Heading)`
  font-size: 16px;
  margin: 0;

  & > *:not(:first-child)::before {
    content: ' / ';
    white-space: pre;
  }
`

const ButtonLink = styled(Button)`
  color: ${themeColor('tint', 'level7')};
  text-decoration: none;

  &:hover {
    background-color: ${themeColor('tint', 'level4')};
    color: ${themeColor('tint', 'level7')};
  }
`

const ParentLink = styled(Link)`
  text-decoration: underline;
  color: black;
`

const DetailHeader = () => {
  const { incident, update } = useContext(IncidentDetailContext)
  const location = useLocation()

  const showSplitButton = useMemo(() => {
    if (['o', 'a', 's'].includes(incident.status.state)) return false

    if (incident?._links?.['sia:parent']) return false

    const children = incident?._links?.['sia:children']
    if (children?.length && children.length >= 10) return false

    return true
  }, [incident])

  const canThor = ['m', 'i', 'b', 'h', 'send failed', 'reopened'].includes(
    incident.status.state
  )
  const downloadLink = incident?._links?.['sia:pdf']?.href

  const referrer = location.referrer?.startsWith(MAP_URL)
    ? MAP_URL
    : INCIDENTS_URL
  const parentId = incident?._links?.['sia:parent']?.href?.split('/').pop()

  const hasChildren = incident?._links?.['sia:children']?.length > 0
  let headingText = 'Standaardmelding'
  if (hasChildren) {
    headingText = 'Hoofdmelding'
  } else if (parentId) {
    headingText = 'Deelmelding'
  }

  const patchIncident = useCallback(() => {
    const patch = {
      type: PATCH_TYPE_THOR,
      patch: {
        status: {
          state: 'ready to send',
          text: 'Te verzenden naar THOR',
          target_api: 'sigmax',
        },
      },
    }

    update(patch)
  }, [update])

  return (
    <Header className="detail-header">
      <BackLinkContainer>
        <StyledBackLink to={referrer}>Terug naar overzicht</StyledBackLink>
      </BackLinkContainer>

      <HeadingContainer>
        <StyledHeading data-testid="detail-header-title">
          {headingText}&nbsp;
          <span>{incident.id}</span>
        </StyledHeading>
      </HeadingContainer>

      <ButtonContainer>
        {showSplitButton && (
          <Button
            type="button"
            variant="application"
            forwardedAs={Link}
            to={`${INCIDENT_URL}/${incident.id}/split`}
            data-testid="detail-header-button-split"
          >
            Delen
          </Button>
        )}

        {canThor && (
          <Button
            type="button"
            variant="application"
            onClick={patchIncident}
            data-testid="detail-header-button-thor"
          >
            THOR
          </Button>
        )}

        <DownloadButton
          label="PDF"
          url={downloadLink}
          filename={`${configuration.language.shortTitle}-${incident.id}.pdf`}
          data-testid="detail-header-button-download"
        />
      </ButtonContainer>
    </Header>
  )
}

export default DetailHeader
