// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import type { FunctionComponent, Reducer, SyntheticEvent } from 'react'
import { useCallback, useContext, useEffect, useReducer, useState } from 'react'

import { Alert, Heading, Label, Select } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'

import AddNote from 'components/AddNote'
import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import { changeStatusOptionList } from 'signals/incident-management/definitions/statusList'
import type { Status } from 'signals/incident-management/definitions/types'
import type { DefaultTexts as DefaultTextsType } from 'types/api/default-text'
import type { Incident } from 'types/api/incident'
import type { StandardText as StandardTextType } from 'types/api/standard-texts'
import { StatusCode } from 'types/status-code'

import type { StatusFormActions } from './actions'
import DefaultTextsContainer from './components/DefaultTexts'
import StandardTextsContainer from './components/StandardTexts'
import * as constants from './constants'
import type { State } from './reducer'
import reducer, { init } from './reducer'
import {
  AddNoteWrapper,
  Form,
  StyledAlert,
  StyledButton,
  StyledCheckbox,
  StyledCheckboxLabel,
  StyledH4,
  StyledLabel,
  StyledParagraph,
  StyledSection,
} from './styled'
import { PATCH_TYPE_STATUS } from '../../constants'
import IncidentDetailContext from '../../context'
import type { EmailTemplate, IncidentChild } from '../../types'
import EmailPreview from '../EmailPreview/EmailPreview'

interface StandardTextResponse {
  results: StandardTextType[]
}
interface StatusFormProps {
  defaultTexts: DefaultTextsType | StandardTextResponse
  childIncidents: IncidentChild[]
  onClose: () => void
}

let lastActiveElement: HTMLElement | null = null

const StatusForm: FunctionComponent<StatusFormProps> = ({
  defaultTexts,
  childIncidents,
  onClose,
}) => {
  const { incident, update } = useContext(IncidentDetailContext)
  const storeDispatch = useDispatch()
  const incidentAsIncident = incident as Incident
  const [emailIsNotSend, setEmailIsNotSend] = useState(false)
  const [modalStandardTextIsOpen, setModalStandardTextIsOpen] = useState(false)
  const [modalEmailPreviewIsOpen, setModalEmailPreviewIsOpen] = useState(false)
  const [state, dispatch] = useReducer<
    Reducer<State, StatusFormActions>,
    { incident: Incident; childIncidents: IncidentChild[] }
  >(reducer, { incident: incidentAsIncident, childIncidents }, init)
  const {
    post: getEmailTemplate,
    data: emailTemplate,
    error: emailTemplateError,
    isLoading,
  } = useFetch<EmailTemplate>()

  const openStandardTextModal = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault()
      setModalStandardTextIsOpen(true)
      lastActiveElement = document.activeElement as HTMLElement
    },
    [setModalStandardTextIsOpen]
  )

  const closeStandardTextModal = useCallback(() => {
    setModalStandardTextIsOpen(false)

    if (lastActiveElement) {
      lastActiveElement.focus()
    }
  }, [setModalStandardTextIsOpen])

  const closeEmailPreview = useCallback(() => {
    setModalEmailPreviewIsOpen(false)

    if (lastActiveElement) {
      lastActiveElement.focus()
    }
  }, [setModalEmailPreviewIsOpen])

  const openEmailPreviewModal = useCallback(() => {
    setModalEmailPreviewIsOpen(true)
    lastActiveElement = document.activeElement as HTMLElement
  }, [setModalEmailPreviewIsOpen])

  const disableSubmit = Boolean(
    state.warnings.some(({ level }) => level === 'error')
  )

  const onUpdate = useCallback(() => {
    const textValue = state.text.value || state.text.defaultValue
    update({
      type: PATCH_TYPE_STATUS,
      patch: {
        status: {
          state: state.status.key,
          text: textValue,
          send_email: state.check.checked,
        },
      },
    })

    closeEmailPreview()
    onClose()
  }, [
    state.text.value,
    state.text.defaultValue,
    state.status.key,
    state.check.checked,
    update,
    closeEmailPreview,
    onClose,
  ])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const textValue = state.text.value || state.text.defaultValue

      if (state.text.required && !textValue) {
        dispatch({
          type: 'SET_ERRORS',
          payload: { text: 'Dit veld is verplicht' },
        })
        return
      }

      if (textValue.length > state.text.maxLength) {
        dispatch({
          type: 'SET_ERRORS',
          payload: {
            text: `Je hebt meer dan de maximale ${state.text.maxLength} tekens ingevoerd.`,
          },
        })
        return
      }

      if (/{{|}}|__/gi.test(textValue)) {
        dispatch({
          type: 'SET_ERRORS',
          payload: {
            text: "Er is een gereserveerd teken ('{{' of '__') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan.",
          },
        })
        return
      }

      if (
        incident?.id &&
        state.flags.hasEmail &&
        state.check.checked &&
        incident?.reporter?.allows_contact
      ) {
        getEmailTemplate(
          `${configuration.INCIDENTS_ENDPOINT}${incident.id}/email/preview`,
          {
            status: state.status.key,
            text: textValue,
          }
        )
      } else {
        onUpdate()
      }
    },
    [
      incident,
      state.flags.hasEmail,
      state.status.key,
      state.text.value,
      state.text.defaultValue,
      state.text.required,
      state.text.maxLength,
      state.check.checked,
      onUpdate,
      getEmailTemplate,
    ]
  )

  const setDefaultText = useCallback((_event, text) => {
    dispatch({ type: 'SET_DEFAULT_TEXT', payload: text })
  }, [])

  const onCheck = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHECK', payload: undefined })
  }, [])

  const onTextChange = useCallback((event) => {
    dispatch({ type: 'SET_TEXT', payload: event.target.value })
  }, [])

  const onStatusChange = useCallback((event) => {
    if (
      !configuration.featureFlags.reporterMailHandledNegativeContactEnabled &&
      event.target.value === StatusCode.Afgehandeld &&
      state.status.key === StatusCode.VerzoekTotHeropenen
    ) {
      setEmailIsNotSend(true)
    }

    const selectedStatus = changeStatusOptionList.find(
      (status) => event.target.value === status.key
    )
    selectedStatus &&
      dispatch({
        type: 'SET_STATUS',
        payload: {
          ...selectedStatus,
          category_slug: incident?.category?.sub_slug,
        },
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const useDefaultText = useCallback(
    (event: SyntheticEvent, text: string) => {
      setDefaultText(event, text)
      closeStandardTextModal()
    },
    [closeStandardTextModal, setDefaultText]
  )

  useEffect(() => {
    if (!emailTemplate) return

    if (emailTemplate?.html) {
      openEmailPreviewModal()
      dispatch({ type: 'SET_EMAIL_TEMPLATE', payload: emailTemplate })
    }
  }, [emailTemplate, openEmailPreviewModal, dispatch])

  useEffect(() => {
    if (emailTemplateError) {
      storeDispatch(
        showGlobalNotification({
          title:
            'Er is geen email template beschikbaar voor de gegeven statustransitie',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [emailTemplateError, storeDispatch])

  return (
    <Form onSubmit={handleSubmit} data-testid="status-form" noValidate>
      <StyledH4 forwardedAs="h2">Status wijzigen</StyledH4>

      <StyledSection>
        <StyledLabel htmlFor="status" label="Status" />
        <Select
          data-testid="select-status"
          id="status"
          value={state.status.key}
          onChange={onStatusChange}
        >
          <option key="default">Kies status</option>
          {changeStatusOptionList.map((status: Status) => (
            <option key={status.key} value={status.key}>
              {status.value}
            </option>
          ))}
        </Select>
      </StyledSection>

      <StyledSection>
        {state.warnings.length > 0 &&
          state.warnings.map((warning) => (
            <StyledAlert
              key={warning.key}
              data-testid={warning.key}
              level={warning.level}
            >
              {warning.heading && <Heading as="h3">{warning.heading}</Heading>}
              {warning.content && (
                <StyledParagraph>{warning.content}</StyledParagraph>
              )}
            </StyledAlert>
          ))}

        <StyledLabel label="Versturen" />

        {state.flags.isSplitIncident &&
          (state.status.key === StatusCode.ReactieGevraagd ? (
            <Alert data-testid="split-incident-reply-warning" level="info">
              {constants.REPLY_DEELMELDING_EXPLANATION}
            </Alert>
          ) : (
            <Alert data-testid="split-incident-warning" level="info">
              {constants.DEELMELDING_EXPLANATION}
            </Alert>
          ))}
        {!state.flags.isSplitIncident && !emailIsNotSend && (
          <div>
            {state.flags.hasEmail ? (
              incident?.reporter?.allows_contact ? (
                <StyledCheckboxLabel
                  disabled={state.check.disabled}
                  htmlFor="send_email"
                  label={constants.MELDING_CHECKBOX_DESCRIPTION}
                  noActiveState
                >
                  <StyledCheckbox
                    checked={state.check.checked}
                    data-testid="send-email-checkbox"
                    disabled={state.check.disabled}
                    id="send_email"
                    onClick={onCheck}
                  />
                </StyledCheckboxLabel>
              ) : (
                <div data-testid="no-contact-allowed-warning">
                  {constants.NO_CONTACT_ALLOWED}
                </div>
              )
            ) : (
              <div data-testid="no-email-warning">
                {constants.NO_REPORTER_EMAIL}
              </div>
            )}
          </div>
        )}
        {emailIsNotSend && (
          <div data-testid="no-emaiI-is-sent-warning">
            {constants.NO_EMAIL_IS_SENT}
          </div>
        )}
      </StyledSection>
      <StyledSection>
        <AddNoteWrapper>
          <Label
            htmlFor="addNoteText"
            label={
              <>
                <strong>
                  {state.check.checked &&
                  state.flags.hasEmail &&
                  incident?.reporter?.allows_contact
                    ? state.text.label
                    : 'Toelichting'}
                </strong>
                {!state.text.required && <span>&nbsp;(niet verplicht)</span>}
              </>
            }
          />
          <ErrorWrapper invalid={Boolean(state.errors.text)}>
            <div role="status">
              {state.errors.text && (
                <ErrorMessage
                  id="textareaErrorMessage"
                  message={state.errors.text}
                />
              )}
            </div>

            {configuration.featureFlags.showStandardTextAdminV1 && (
              <DefaultTextsContainer
                openStandardTextModal={openStandardTextModal}
                state={state}
                modalStandardTextIsOpen={modalStandardTextIsOpen}
                useDefaultText={useDefaultText}
                closeStandardTextModal={closeStandardTextModal}
                defaultTexts={defaultTexts as DefaultTextsType}
              />
            )}

            {configuration.featureFlags.showStandardTextAdminV2 && (
              <StandardTextsContainer
                openStandardTextModal={openStandardTextModal}
                state={state}
                modalStandardTextIsOpen={modalStandardTextIsOpen}
                useStandardText={useDefaultText}
                closeStandardTextModal={closeStandardTextModal}
                standardTexts={defaultTexts as StandardTextResponse}
              />
            )}

            <AddNote
              data-testid="text"
              isStandalone={false}
              label={''}
              maxContentLength={state.text.maxLength}
              name="text"
              onChange={onTextChange}
              rows={state.text.rows}
              value={state.text.value || state.text.defaultValue}
            />
          </ErrorWrapper>
        </AddNoteWrapper>
      </StyledSection>
      <div>
        <StyledButton
          data-testid="status-form-submit-button"
          type="submit"
          variant="secondary"
          disabled={disableSubmit}
        >
          {state.flags.hasEmail && state.check.checked ? 'Verstuur' : 'Opslaan'}
        </StyledButton>

        <StyledButton
          data-testid="status-form-cancel-button"
          variant="tertiary"
          onClick={onClose}
        >
          Annuleer
        </StyledButton>
        {modalEmailPreviewIsOpen && (
          <EmailPreview
            isLoading={isLoading}
            title="Controleer bericht aan melder"
            emailBody={emailTemplate?.html}
            onClose={closeEmailPreview}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </Form>
  )
}

export default StatusForm
