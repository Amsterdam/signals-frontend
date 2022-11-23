/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { Fragment, useEffect } from 'react'

import format from 'date-fns/format'
import nl from 'date-fns/locale/nl'
import { useHistory } from 'react-router-dom'

import useFetch from '../../../../hooks/useFetch'
import useLocationReferrer from '../../../../hooks/useLocationReferrer'
import configuration from '../../../../shared/services/configuration/configuration'
import { routes } from '../../definitions'
import type { HistoryInstance, MyIncident } from '../../types'
import { FormTitle } from '../IncidentsDetail/styled'
import {
  StatusBlock,
  Wrapper,
  Status,
  StyledH2,
  StatusParagraph,
  StyledParagraph,
} from './styled'

export interface Props {
  incident?: MyIncident
}

export const History = ({ incident }: Props) => {
  const { get, data, error } = useFetch<HistoryInstance[]>()
  const location = useLocationReferrer() as Location
  const history = useHistory()

  useEffect(() => {
    const locationPathArray = location.pathname.split('/')
    const token = locationPathArray[locationPathArray.length - 2]
    const uuid = locationPathArray[locationPathArray.length - 1]
    get(
      `${configuration.MY_SIGNALS_ENDPOINT}/${uuid}/history`,
      {},
      {},
      { Authorization: `Token ${token}` }
    )
  }, [get, location.pathname])

  useEffect(() => {
    if (error) {
      history.push(routes.expired)
    }
  }, [error, history])

  return (
    <Wrapper>
      <StatusBlock>
        <Status>Status</Status>
        <StatusParagraph>{incident?.status.state_display}</StatusParagraph>
      </StatusBlock>
      <StyledH2 forwardedAs="h2">Geschiedenis</StyledH2>

      {data &&
        data.map((instance: HistoryInstance, index) => {
          const { when, action, description } = instance
          const date = new Date(when)
          const formattedDate = format(date, 'd MMMM yyyy, HH:mm', {
            locale: nl,
          })
          return (
            <Fragment key={formattedDate + index}>
              <FormTitle>{formattedDate}</FormTitle>
              <StyledParagraph>
                {action}
                {'\n'}
                {description}
              </StyledParagraph>
            </Fragment>
          )
        })}
    </Wrapper>
  )
}
