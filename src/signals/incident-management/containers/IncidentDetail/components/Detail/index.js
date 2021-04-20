// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React, { Fragment, useMemo, useContext } from 'react'
import styled from 'styled-components'
import { themeColor, themeSpacing, Heading } from '@amsterdam/asc-ui'

import { attachmentsType, contextType } from 'shared/types'
import { string2date, string2time } from 'shared/services/string-parser'

import IncidentDetailContext from '../../context'

import Location from './components/Location'
import Attachments from './components/Attachments'
import ExtraProperties from './components/ExtraProperties'
import Context from './components/Context'

const Wrapper = styled.article`
  position: relative;
  z-index: 0;
`

const Title = styled(Heading)`
  font-weight: 400;
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

const Detail = ({ attachments, context }) => {
  const { incident } = useContext(IncidentDetailContext)
  const memoIncident = useMemo(() => incident, [incident])
  const memoAttachments = useMemo(() => attachments, [attachments])
  const location = useMemo(() => incident.location, [incident.location])

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

        <Location location={location} />

        {memoAttachments && <Attachments attachments={memoAttachments} />}

        {memoIncident.extra_properties && (
          <ExtraProperties items={memoIncident.extra_properties} />
        )}

        <Fragment>
          <dt data-testid="detail-phone-definition">Telefoon melder</dt>
          <dd data-testid="detail-phone-value">{incident.reporter.phone}</dd>
        </Fragment>

        <Fragment>
          <dt data-testid="detail-email-definition">E-mail melder</dt>
          <dd data-testid="detail-email-value">{incident.reporter.email}</dd>
        </Fragment>

        <dt data-testid="detail-sharing-definition">
          Toestemming contactgegevens delen
        </dt>
        <dd data-testid="detail-sharing-value">
          {incident.reporter.sharing_allowed ? 'Ja' : 'Nee'}
        </dd>

        {context && <Context context={context} id={incident.id} />}
      </DefinitionList>
    </Wrapper>
  )
}

Detail.propTypes = {
  attachments: attachmentsType,
  context: contextType,
}

export default Detail
