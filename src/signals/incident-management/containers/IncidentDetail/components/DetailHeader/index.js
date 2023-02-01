// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { useCallback, useContext, useMemo } from 'react'

import { themeColor, themeSpacing, Heading, styles } from '@amsterdam/asc-ui'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import BackLink from 'components/BackLink'
import Button from 'components/Button'
import configuration from 'shared/services/configuration/configuration'
import {
  isStatusEnd,
  isStatusClosed,
} from 'signals/incident-management/definitions/statusList'
import {
  MAP_URL,
  INCIDENT_URL,
  INCIDENTS_URL,
} from 'signals/incident-management/routes'

import DownloadButton from './components/DownloadButton'
import { PATCH_TYPE_THOR } from '../../constants'
import IncidentDetailContext from '../../context'

const Header = styled.header`
  padding: ${themeSpacing(2, 0)};
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  width: 100%;
`

const StyledBackLink = styled(BackLink)`
  margin: ${themeSpacing(4)} 0;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${themeSpacing(2)};
`

const HeadingContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${themeSpacing(1)};

  && > * {
    margin: 0;
  }

  & > ${styles.HeaderStyles} {
    font-weight: 400;
  }
`

const StyledHeading = styled(Heading)`
  font-size: 1rem;
  margin: 0;

  & > *:not(:first-child)::before {
    content: ' / ';
    white-space: pre;
  }
`

const DetailHeader = () => {
  const { incident, update, toggleExternal } = useContext(IncidentDetailContext)
  const location = useLocation()

  const showSplitButton = useMemo(() => {
    if (isStatusEnd(incident.status?.state)) return false

    if (incident?._links?.['sia:parent']) return false

    const children = incident?._links?.['sia:children']
    if (children?.length && children.length >= 10) return false

    return true
  }, [incident])

  const forwardToExternalIsAllowed = !isStatusClosed(incident.status?.state)
  const thorIsAllowed = [
    'm',
    'i',
    'b',
    'h',
    'send failed',
    'reopened',
  ].includes(incident.status?.state)
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
      <StyledBackLink to={referrer}>Terug naar overzicht</StyledBackLink>

      <HeadingContainer>
        <StyledHeading data-testid="detail-header-title">
          {headingText}&nbsp;
          <span>{incident.id}</span>
        </StyledHeading>

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

          {thorIsAllowed && configuration.featureFlags.showThorButton && (
            <Button
              type="button"
              variant="application"
              onClick={patchIncident}
              data-testid="detail-header-button-thor"
            >
              THOR
            </Button>
          )}

          {forwardToExternalIsAllowed &&
            configuration.featureFlags.enableForwardIncidentToExternal && (
              <Button
                type="button"
                variant="application"
                onClick={() => toggleExternal()}
                data-testid="detail-header-button-external"
                title="Doorzetten naar extern"
              >
                Extern
              </Button>
            )}

          <DownloadButton
            label="PDF"
            url={downloadLink}
            filename={`${configuration.language.shortTitle}-${incident.id}.pdf`}
            data-testid="detail-header-button-download"
          />
        </ButtonContainer>
      </HeadingContainer>
    </Header>
  )
}

export default DetailHeader
