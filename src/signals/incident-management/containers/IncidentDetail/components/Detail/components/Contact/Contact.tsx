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

import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import useFetchResponseNotification from 'signals/settings/hooks/useFetchResponseNotification'
import type { Incident } from 'types/incident'

import Cancel from './Cancel'
import Edit from './Edit'
import { StyledDD, StyledEditButton, StyledLink } from './styled'
import { makeSelectUserCan } from '../../../../../../../../containers/App/selectors'
import IncidentDetailContext from '../../../../context'
import type { Result, SignalReporter } from '../../../../types'

type Props = {
  incident: Incident
  showPhone: boolean
}

const SIA_CAN_VIEW_CONTACT_DETAILS = 'sia_can_view_contact_details'

export const Contact = ({ incident, showPhone }: Props) => {
  const userCan = useSelector(makeSelectUserCan)

  const [activeComponent, setActiveComponent] = useState<
    'edit' | 'cancel' | null
  >(null)

  const {
    post,
    get,
    error,
    data: signalReportersData,
  } = useFetch<Result<SignalReporter>>()

  const { getIncident } = useContext(IncidentDetailContext)
  const params = useParams()

  const onClose = useCallback(() => {
    setActiveComponent(null)
  }, [])

  const syncData = useCallback(() => {
    getIncident &&
      getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}`)
    get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters`)
  }, [get, getIncident, params.id])

  const submitEdit = useCallback(
    async (data, hasDirtyFields) => {
      if (hasDirtyFields) {
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

        syncData()
      }
      onClose()
    },
    [
      incident.reporter.email,
      incident.reporter.phone,
      incident.reporter.sharing_allowed,
      onClose,
      params.id,
      post,
      syncData,
    ]
  )

  const cancelableReporterId = useMemo(() => {
    const signalReportsCount = signalReportersData?.results?.length || 0
    return (
      signalReportsCount > 1 &&
      signalReportersData?.results?.find(
        (result) =>
          result.state === 'verification_email_sent' || result.state === 'new'
      )?.id
    )
  }, [signalReportersData?.results])

  const submitCancel = useCallback(
    async (data) => {
      await post(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters/${cancelableReporterId}/cancel`,
        data
      )

      syncData()
    },
    [cancelableReporterId, params.id, post, syncData]
  )

  useEffect(() => {
    get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${params.id}/reporters`)
  }, [get, params.id])

  /**
   * If the user is not allowed to view the contact details, we don't want to show the error. There is no need cause
   * the user can't do anything with it.
   */
  useFetchResponseNotification({
    entityName: 'Contactgegevens',
    error: userCan(SIA_CAN_VIEW_CONTACT_DETAILS) ? error : undefined,
    isLoading: false,
    isSuccess: false,
    redirectURL: '',
  })

  const emailChanged = useMemo(() => {
    return signalReportersData?.results?.find(
      (result) => result.state === 'verification_email_sent'
    )
  }, [signalReportersData])

  return (
    <Fragment>
      <dt data-testid="detail-phone-definition" aria-label="phone">
        Telefoon melder
      </dt>
      {configuration.featureFlags.showContactEdit && (
        <>
          {activeComponent === 'edit' && (
            <Edit incident={incident} submit={submitEdit} onClose={onClose} />
          )}
          {activeComponent === 'cancel' && (
            <Cancel onClose={onClose} onSubmit={submitCancel} />
          )}
        </>
      )}
      {!activeComponent && (
        <StyledDD data-testid="detail-phone-value">
          {configuration.featureFlags.showContactEdit &&
            userCan(SIA_CAN_VIEW_CONTACT_DETAILS) && (
              <StyledEditButton
                data-testid="edit-contact-button"
                icon={<img src="/assets/images/icon-edit.svg" alt="Bewerken" />}
                iconSize={18}
                onClick={() => {
                  setActiveComponent('edit')
                }}
                type="button"
                variant="application"
              />
            )}
          {showPhone && incident.reporter.phone ? (
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

      <dt data-testid="detail-email-definition" aria-label="email">
        E-mail melder
      </dt>
      {!activeComponent && (
        <dd data-testid="detail-email-value">
          {`${incident.reporter.email}`}
          {emailChanged && configuration.featureFlags.showContactEdit
            ? ' (verificatie verzonden)'
            : ''}

          {configuration.featureFlags.showContactEdit &&
            cancelableReporterId && (
              <StyledLink
                variant="inline"
                href={'#'}
                onClick={() => setActiveComponent('cancel')}
              >
                Verificatie annuleren
              </StyledLink>
            )}
        </dd>
      )}
    </Fragment>
  )
}
