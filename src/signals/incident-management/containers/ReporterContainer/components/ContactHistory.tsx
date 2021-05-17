// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import { FunctionComponent, useEffect, useMemo } from 'react'
import configuration from 'shared/services/configuration/configuration'
import LoadingIndicator from 'components/LoadingIndicator'
import HistoryList from 'components/HistoryList'
import { useDispatch } from 'react-redux'
import { History } from 'types/history'
import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

const headerMapper: Record<string, string> = {
  ['Feedback van melder ontvangen']: 'Feedback',
  ['Status gewijzigd naar: Afgehandeld']: 'Toelichting bij Afgehandeld',
  ['Status gewijzigd naar: Heropend']: 'Toelichting bij Heropend',
}

const Text = styled.p`
  margin-top: ${themeSpacing(2)};
  color: ${themeColor('tint', 'level5')};
`

interface ContactHistoryProps {
  id: number
}

const ContactHistory: FunctionComponent<ContactHistoryProps> = ({ id }) => {
  const storeDispatch = useDispatch()
  const { get, isLoading, data: history, error } = useFetch<History[]>()

  useEffect(() => {
    get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`)
  }, [id, get])

  useEffect(() => {
    if (error) {
      storeDispatch(
        showGlobalNotification({
          title:
            'De data kon niet opgehaald worden. probeer het later nog eens.',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [error, storeDispatch])

  const contactHistory = useMemo(
    () =>
      history?.filter(({ action }) => {
        return Object.keys(headerMapper).includes(action)
      }),
    [history]
  )

  if (error) return null

  if (isLoading) return <LoadingIndicator />

  if (!contactHistory || contactHistory.length === 0)
    return (
      <Text data-testid="noContactHistory">
        Er is nog geen contact geweest met deze melder
      </Text>
    )

  return <HistoryList list={contactHistory} />
}

export default ContactHistory
