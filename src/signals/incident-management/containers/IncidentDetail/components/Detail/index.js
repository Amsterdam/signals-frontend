// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { Fragment, useMemo, useContext } from 'react'
import styled from 'styled-components'
import {
  themeColor,
  themeSpacing,
  Heading,
  Link as AscLink,
} from '@amsterdam/asc-ui'

import { attachmentsType, contextType } from 'shared/types'
import { string2date, string2time } from 'shared/services/string-parser'
import configuration from 'shared/services/configuration/configuration'

import IncidentDetailContext from '../../context'
import Location from './components/Location'
import ExtraProperties from './components/ExtraProperties'
import Reporter from './components/Reporter'
import Area from './components/Area'

const Wrapper = styled.article`
  contain: content;
  position: relative;
  z-index: 0;
`

const Title = styled(Heading)`
  margin: ${themeSpacing(4)} 0;
`

const DefinitionList = styled.dl`
  margin: 0;
  display: grid;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    column-gap: ${({ theme }) => theme.layouts.medium.gutter}px;
    grid-template-columns: 2fr 4fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    grid-template-columns: 3fr 4fr;
  }

  dt,
  dd {
    @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
      padding: ${themeSpacing(2)} 0;
    }
  }

  dt {
    color: ${themeColor('tint', 'level5')};
    margin: 0;
    font-weight: 400;
  }

  dd {
    padding-bottom: ${themeSpacing(2)};
    width: 100%;
  }
`

const StyledLink = styled(AscLink)`
  font-size: inherit;
`

const Detail = ({ context }) => {
  const { incident } = useContext(IncidentDetailContext)
  const memoIncident = useMemo(() => incident, [incident])
  const location = useMemo(() => incident.location, [incident.location])
  const showArea = useMemo(
    () =>
      Boolean(
        configuration.featureFlags.enableNearIncidents &&
          typeof context?.near?.signal_count === 'number'
      ),
    [context?.near?.signal_count]
  )
  const showPhone = useMemo(() => {
    const phoneNumber = incident.reporter.phone?.replaceAll(' ', '')
    return !/[ *]/.test(phoneNumber)
  }, [incident.reporter.phone])

  return (
    <Wrapper data-testid="incidentDetailDetail">
      <Title data-testid="detail-title" forwardedAs="h2" styleAs="h4">
        {incident.text}
      </Title>

      <DefinitionList>
        <dt>Overlast</dt>
        <dd>
          {string2date(incident.incident_date_start)}{' '}
          {string2time(incident.incident_date_start)}&nbsp;
        </dd>

        {location && <Location location={location} />}

        {showArea && (
          <Area count={context.near.signal_count} id={incident.id} />
        )}

        {memoIncident.extra_properties && (
          <ExtraProperties items={memoIncident.extra_properties} />
        )}

        {incident.reporter && (
          <Fragment>
            <dt data-testid="detail-phone-definition">Telefoon melder</dt>
            <dd data-testid="detail-phone-value">
              {showPhone ? (
                <StyledLink
                  data-testid="detail-phone-link"
                  variant="inline"
                  href={`tel:${incident.reporter.phone}`}
                >
                  {incident.reporter.phone}
                </StyledLink>
              ) : (
                incident.reporter.phone
              )}
            </dd>

            <dt data-testid="detail-email-definition">E-mail melder</dt>
            <dd data-testid="detail-email-value">{incident.reporter.email}</dd>

            <dt data-testid="detail-sharing-definition">
              Toestemming contactgegevens delen
            </dt>
            <dd data-testid="detail-sharing-value">
              {incident.reporter.sharing_allowed ? 'Ja' : 'Nee'}
            </dd>
          </Fragment>
        )}

        {context?.reporter && (
          <Reporter reporter={context.reporter} id={incident.id} />
        )}
      </DefinitionList>
    </Wrapper>
  )
}

Detail.propTypes = {
  attachments: attachmentsType,
  context: contextType,
}

export default Detail
