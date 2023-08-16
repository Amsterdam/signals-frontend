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
  const { post, isSuccess, get, data } = useFetch<Result<SignalReporter>>()

  const { getHistory, getIncident } = useContext(IncidentDetailContext)

  const params = useParams()

  const onClose = useCallback(() => {
    setShowEdit(false)
  }, [])

  const submit = useCallback(
    (data) => {
      data.sharing_allowed = incident.reporter.sharing_allowed
      post(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters`,
        data
      )
      onClose()
    },
    [incident.reporter.sharing_allowed, onClose, params.id, post]
  )

  useEffect(() => {
    if (isSuccess) {
      getHistory &&
        getHistory(
          `${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/history`
        )

      getIncident &&
        getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}`)
      get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters`)
    }
  }, [get, getHistory, getIncident, isSuccess, params.id])

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
          emailChanged ? ' (verificatie e-mail verstuurd)' : ''
        }`}</dd>
      )}
    </Fragment>
  )
}
