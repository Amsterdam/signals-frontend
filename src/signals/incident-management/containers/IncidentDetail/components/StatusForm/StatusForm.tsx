// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { FunctionComponent, Reducer, SyntheticEvent } from 'react'
import { useCallback, useReducer, useContext, useState, useEffect } from 'react'
import { Alert, Heading, Label, Modal } from '@amsterdam/asc-ui'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import useEventEmitter from 'hooks/useEventEmitter'

import { changeStatusOptionList } from 'signals/incident-management/definitions/statusList'

import Paragraph from 'components/Paragraph'
import Checkbox from 'components/Checkbox'
import AddNote from 'components/AddNote'
import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'

import type { DefaultTexts as DefaultTextsType } from 'types/api/default-text'
import type { Incident } from 'types/api/incident'

import RadioButtonList from 'signals/incident-management/components/RadioButtonList'
import { StatusCode } from 'signals/incident-management/definitions/types'

import IncidentDetailContext from '../../context'
import { PATCH_TYPE_STATUS } from '../../constants'
import type { IncidentChild } from '../../types'
import DefaultTexts from './components/DefaultTexts'
import {
  AddNoteWrapper,
  Form,
  FormArea,
  HeaderArea,
  OptionsArea,
  QuestionLabel,
  StandardTextsButton,
  StyledAlert,
  StyledButton,
  StyledH4,
  StyledLabel,
  StyledParagraph,
} from './styled'
import * as constants from './constants'
import type { State } from './reducer'
import reducer, { init } from './reducer'
import type { StatusFormActions } from './actions'

interface StatusFormProps {
  defaultTexts: DefaultTextsType
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
  const incidentAsIncident = incident as Incident
  const { listenFor, unlisten } = useEventEmitter()

  const [modalStandardTextIsOpen, setModalStandardTextIsOpen] = useState(false)
  const [state, dispatch] = useReducer<
    Reducer<State, StatusFormActions>,
    { incident: Incident; childIncidents: IncidentChild[] }
  >(reducer, { incident: incidentAsIncident, childIncidents }, init)

  const openStandardTextModal = useCallback(
    (event) => {
      event.preventDefault()
      disablePageScroll()
      setModalStandardTextIsOpen(true)
      lastActiveElement = document.activeElement as HTMLElement
    },
    [modalStandardTextIsOpen]
  )

  const closeStandardTextModal = useCallback(() => {
    enablePageScroll()
    setModalStandardTextIsOpen(false)

    if (lastActiveElement) {
      lastActiveElement.focus()
    }
  }, [setModalStandardTextIsOpen])

  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        closeStandardTextModal()
      }
    },
    [closeStandardTextModal]
  )

  const disableSubmit = Boolean(
    state.warnings.some(({ level }) => level === 'error')
  )

  const onRadioChange = useCallback((_name, selectedStatus) => {
    dispatch({ type: 'SET_STATUS', payload: selectedStatus })
  }, [])

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

      onClose()
    },
    [
      state.text.value,
      state.text.defaultValue,
      state.text.required,
      state.text.maxLength,
      state.status.key,
      state.check.checked,
      update,
      onClose,
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

  const defaultTextTemplatesLength = () => {
    if (!defaultTexts || defaultTexts.length === 0) {
      return 0
    }
    const statusDefaultTexts = defaultTexts.filter(
      (text) => text.state === state.status.key
    )
    return statusDefaultTexts[0] ? statusDefaultTexts[0].templates?.length : 0
  }

  const useDefaultText = (event: SyntheticEvent, text: string) => {
    setDefaultText(event, text)
    closeStandardTextModal()
  }

  useEffect(() => {
    listenFor('keydown', escFunction)
    return () => {
      unlisten('keydown', escFunction)
    }
  }, [escFunction, listenFor, unlisten])

  return (
    <Form onSubmit={handleSubmit} data-testid="statusForm" noValidate>
      <HeaderArea>
        <StyledH4 forwardedAs="h2">Status wijzigen</StyledH4>
      </HeaderArea>

      <OptionsArea>
        <div>
          <StyledLabel htmlFor="status" label="Status" />
          <input type="hidden" name="status" value={state.originalStatus.key} />
          <RadioButtonList
            defaultValue={state.status.key}
            groupName="status"
            hasEmptySelectionButton={false}
            onChange={onRadioChange}
            options={changeStatusOptionList}
          />
        </div>
      </OptionsArea>

      <FormArea>
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
        <div>
          <QuestionLabel>
            <strong>Versturen</strong>
          </QuestionLabel>

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

          {!state.flags.isSplitIncident && (
            <div>
              {state.flags.hasEmail ? (
                <Label
                  disabled={state.check.disabled}
                  htmlFor="send_email"
                  label={constants.MELDING_CHECKBOX_DESCRIPTION}
                  noActiveState
                >
                  <Checkbox
                    checked={state.check.checked}
                    data-testid="sendEmailCheckbox"
                    disabled={state.check.disabled}
                    id="send_email"
                    onClick={onCheck}
                  />
                </Label>
              ) : (
                <div data-testid="no-email-warning">
                  {constants.NO_REPORTER_EMAIL}
                </div>
              )}
            </div>
          )}
        </div>

        <AddNoteWrapper>
          <QuestionLabel>
            <strong>{state.text.label}</strong>
            {!state.text.required && <span>&nbsp;(niet verplicht)</span>}
            {state.text.required &&
              state.check.checked &&
              state.flags.hasEmail && (
                <Paragraph light>{state.text.subtitle}</Paragraph>
              )}
          </QuestionLabel>
          <ErrorWrapper invalid={Boolean(state.errors.text)}>
            <div role="status">
              {state.errors.text && (
                <ErrorMessage
                  id="textareaErrorMessage"
                  message={state.errors.text}
                />
              )}
            </div>

            <StandardTextsButton
              data-testid="standardTextButton"
              variant="primaryInverted"
              onClick={openStandardTextModal}
            >
              <div>{`Standaardtekst (${defaultTextTemplatesLength()})`}</div>
            </StandardTextsButton>
            {modalStandardTextIsOpen && (
              <Modal
                data-testid="standardTextModal"
                open
                onClose={closeStandardTextModal}
                title="Standard texts"
              >
                <DefaultTexts
                  defaultTexts={defaultTexts}
                  onHandleUseDefaultText={useDefaultText}
                  status={state.status.key}
                  onClose={closeStandardTextModal}
                />
              </Modal>
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

        <div>
          <StyledButton
            data-testid="statusFormSubmitButton"
            type="submit"
            variant="secondary"
            disabled={disableSubmit}
          >
            Opslaan
          </StyledButton>

          <StyledButton
            data-testid="statusFormCancelButton"
            variant="tertiary"
            onClick={onClose}
          >
            Annuleer
          </StyledButton>
        </div>
      </FormArea>
    </Form>
  )
}

export default StatusForm
