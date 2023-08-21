// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useParams } from 'react-router-dom'

import Edit from './Edit'
import { StyledDD, StyledEditButton, StyledLink } from './styled'
import { useFetch } from '../../../../../../../../hooks'
import configuration from '../../../../../../../../shared/services/configuration/configuration'
import type { Incident } from '../../../../../../../../types/incident'
import IncidentDetailContext from '../../../../context'
import type { Result, SignalReporter } from '../../../../types'

type Props = {
  incident: Incident
  showPhone: boolean
}

export const Contact = ({ incident, showPhone }: Props) => {
  const [showEdit, setShowEdit] = useState(false)
  const { post, get, data } = useFetch<Result<SignalReporter>>()

  const { getHistory, getIncident } = useContext(IncidentDetailContext)

  const params = useParams()

  const onClose = useCallback(() => {
    setShowEdit(false)
  }, [])

  const submit = useCallback(
    async (data) => {
      data.sharing_allowed = incident.reporter.sharing_allowed

      /**
       * If email and phone both are changed we need to send 2 requests.
       * One to update the email with a resulting email verification. Then one to immediately update the phone number.
       */
      if (
        data.email !== incident.reporter.email &&
        data.phone !== incident.reporter.phone
      ) {
        await post(
          `${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters`,
          {
            ...data,
            email: incident.reporter.email,
          }
        )
      }

      await post(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters`,
        data
      )

      getHistory &&
        getHistory(
          `${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/history`
        )

      getIncident &&
        getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}`)
      get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters`)

      onClose()
    },
    [get, getHistory, getIncident, incident.reporter, onClose, params.id, post]
  )

  useEffect(() => {
    get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters`)
  }, [get, params.id])

  const emailChanged = useMemo(() => {
    return data?.results?.find(
      (result) => result.state === 'verification_email_sent'
    )
  }, [data])

  return (
    <Fragment>
      <dt data-testid="detail-phone-definition">Telefoon melder</dt>
      {showEdit ? (
        <Edit incident={incident} submit={submit} onClose={onClose} />
      ) : (
        <StyledDD data-testid="detail-phone-value">
          <StyledEditButton
            data-testid="edit-contact-button"
            icon={<img src="/assets/images/icon-edit.svg" alt="Bewerken" />}
            iconSize={18}
            onClick={() => {
              setShowEdit(true)
            }}
            type="button"
            variant="application"
          />
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
        </StyledDD>
      )}

      <dt data-testid="detail-email-definition">E-mail melder</dt>
      {!showEdit && (
        <dd data-testid="detail-email-value">{`${incident.reporter.email} ${
          emailChanged ? ' (verificatie verzonden)' : ''
        }`}</dd>
      )}
    </Fragment>
  )
}
