// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Fragment, useEffect } from 'react'

import format from 'date-fns/format'
import nl from 'date-fns/locale/nl'
import { useHistory, Link } from 'react-router-dom'

import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'

import { useMyIncidentContext } from '../../context'
import { routes } from '../../definitions'
import type { MyIncident, Result } from '../../types'
import {
  Divider,
  Heading,
  IncidentID,
  Status,
  StyledParagraph,
  Wrapper,
  StyledLink,
} from './styled'

interface Props {
  token: string
}

export const IncidentsList = ({ token }: Props) => {
  const { get, data, error } = useFetch<Result<MyIncident>>()
  const history = useHistory()
  const { incidentsList, setIncidentsList } = useMyIncidentContext()

  useEffect(() => {
    data && setIncidentsList(data.results)
  }, [data, setIncidentsList])

  useEffect(() => {
    get(
      configuration.MY_SIGNALS_ENDPOINT,
      {},
      {},
      { Authorization: `Token ${token}` }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (error) {
      history.push(routes.expired)
    }
  }, [error, history])

  if (!incidentsList) {
    return null
  }

  return (
    <>
      {incidentsList.map((incident: MyIncident) => {
        const { created_at, _display, status, text, uuid } = incident
        const displayStatus = status.state_display.toLocaleLowerCase()
        const date = new Date(created_at)
        const formattedDate = format(date, 'd MMMM yyyy, HH:mm', {
          locale: nl,
        })

        return (
          <Fragment key={_display}>
            <Divider />
            <Wrapper>
              <Heading>
                <IncidentID>{_display}</IncidentID>
                <span>{`${formattedDate} uur`}</span>
              </Heading>
              <Status status={displayStatus}>Status: {displayStatus}</Status>

              <StyledParagraph>{text}</StyledParagraph>

              <StyledLink
                to={`/mijn-meldingen/${token}/${uuid}`}
                forwardedAs={Link}
              >
                Bekijk melding
              </StyledLink>
            </Wrapper>
          </Fragment>
        )
      })}
      <Divider />
    </>
  )
}