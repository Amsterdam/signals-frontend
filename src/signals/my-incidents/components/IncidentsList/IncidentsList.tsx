// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect } from 'react'

import { Link } from '@amsterdam/asc-ui'
import format from 'date-fns/format'
import nl from 'date-fns/locale/nl'
import { useHistory } from 'react-router-dom'

import useFetch from 'hooks/useFetch'
import useLocationReferrer from 'hooks/useLocationReferrer'
import configuration from 'shared/services/configuration/configuration'

import { routes } from '../../definitions'
import { useMyIncidents } from '../../hooks'
import type { MyIncident, Result } from '../../types'
import {
  Divider,
  Heading,
  IncidentID,
  Status,
  StyledParagraph,
  Wrapper,
} from './styled'

export const IncidentsList = () => {
  const { get, data, error } = useFetch<Result<MyIncident>>()
  const history = useHistory()
  const location = useLocationReferrer() as Location
  const { incidentsList, setIncidentsList } = useMyIncidents()

  useEffect(() => {
    data && setIncidentsList(data.results)
  }, [data, setIncidentsList])

  useEffect(() => {
    const token = location.pathname.split('/').at(-1)
    // TODO: Sanitize get request
    get(
      configuration.MY_SIGNALS_ENDPOINT,
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

  return (
    <>
      {incidentsList &&
        incidentsList.map((incident: MyIncident) => {
          const date = new Date(incident.created_at)
          const formattedDate = format(date, 'd MMMM yyyy, HH:mm aaaaa', {
            locale: nl,
          })

          return (
            <>
              <Divider />
              <Wrapper>
                <Heading>
                  <IncidentID>{incident._display}</IncidentID>
                  <span>{`${formattedDate} uur`}</span>
                </Heading>
                <Status
                  status={incident.status.state_display.toLocaleLowerCase()}
                >
                  Status: {incident.status.state_display.toLocaleLowerCase()}
                </Status>

                <StyledParagraph>{incident.text}</StyledParagraph>

                <Link inList href={`/${incident.uuid}`}>
                  Bekijk melding
                </Link>
              </Wrapper>
            </>
          )
        })}
      <Divider />
    </>
  )
}
