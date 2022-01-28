// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { FunctionComponent, Reducer } from 'react'
import { useCallback, useReducer, useContext, useState, useEffect } from 'react'
import {
  Alert,
  Button,
  Heading,
  Label,
  Modal,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
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
import styled from 'styled-components'

import IncidentDetailContext from '../../context'
import { PATCH_TYPE_STATUS } from '../../constants'
import type { IncidentChild } from '../../types'
import DefaultTexts from './components/DefaultTexts'
import {
  Form,
  FormArea,
  HeaderArea,
  StyledLabel,
  OptionsArea,
  QuestionLabel,
  StyledButton,
  StyledColumn,
  StyledH4,
  TextsArea,
  Wrapper,
} from './styled'
import * as constants from './constants'
import type { State } from './reducer'
import reducer, { init } from './reducer'
import type { StatusFormActions } from './actions'

interface StatusFormProps {
  defaultTexts: DefaultTextsType
  childIncidents: IncidentChild[]
}

const StyledParagraph = styled.p`
  color: ${themeColor('tint', 'level5')};
  margin: 0;
`

const StandardTextsButton = styled(Button)`
  margin-top: ${themeSpacing(2)};
  border-bottom: none;
  border-color: ${themeColor('tint', 'level5')};
  padding-bottom: 0;
  width: 100%;
  :hover {
    outline-style: none;
  }
  div {
    font-weight: normal;
    font-family: 'Avenir Next';
    text-align: left;
    width: 100%;
    height: 100%;
    padding-bottom: ${themeSpacing(3)};
    border-bottom: 1px solid ${themeColor('tint', 'level4')};
  }
`

const AddNoteWrapper = styled.div`
  label {
    display: none;
  }
  section div textarea {
    margin-top: 0;
    border-top: 1px solid transparent;
    :hover {
      border-top-color: transparent;
    }
  }
`

let lastActiveElement: HTMLElement | null = null

const StatusForm: FunctionComponent<StatusFormProps> = ({
  defaultTexts,
  childIncidents,
}) => {
  const { incident, update, close } = useContext(IncidentDetailContext)
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

      close()
    },
    [
      state.text.value,
      state.text.defaultValue,
      state.text.required,
      state.text.maxLength,
      state.status.key,
      state.check.checked,
      update,
      close,
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

  useEffect(() => {
    listenFor('keydown', escFunction)
    return () => {
      unlisten('keydown', escFunction)
    }
  }, [escFunction, listenFor, unlisten])

  return (
    <Wrapper>
      <StyledColumn span={12}>
        <Form onSubmit={handleSubmit} data-testid="statusForm" noValidate>
          <HeaderArea>
            <StyledH4 forwardedAs="h2">Status wijzigen</StyledH4>

            <div data-testid="originalStatus">
              <StyledLabel label="Huidige status" />
              <div>{state.originalStatus.value}</div>
            </div>
          </HeaderArea>

          <OptionsArea>
            <div>
              <StyledLabel htmlFor="status" label="Nieuwe status" />
              <input
                type="hidden"
                name="status"
                value={state.originalStatus.key}
              />
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
                <Alert
                  key={warning.key}
                  data-testid={warning.key}
                  level={warning.level}
                >
                  {warning.heading && (
                    <Heading as="h3">{warning.heading}</Heading>
                  )}
                  {warning.content && (
                    <StyledParagraph>{warning.content}</StyledParagraph>
                  )}
                </Alert>
              ))}
            <div>
              <QuestionLabel>
                <strong>Versturen</strong>
              </QuestionLabel>

              {state.flags.isSplitIncident &&
                (state.status.key === StatusCode.ReactieGevraagd ? (
                  <Alert
                    data-testid="split-incident-reply-warning"
                    level="info"
                  >
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
                    <Alert data-testid="no-email-warning">
                      {constants.NO_REPORTER_EMAIL}
                    </Alert>
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
                  variant="primaryInverted"
                  onClick={openStandardTextModal}
                >
                  <div>
                    {`Standaardtekst (${defaultTextTemplatesLength()})`}
                  </div>
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
                      onHandleUseDefaultText={setDefaultText}
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
                onClick={close}
              >
                Annuleer
              </StyledButton>
            </div>
          </FormArea>
          <TextsArea>
            <DefaultTexts
              defaultTexts={defaultTexts}
              onHandleUseDefaultText={setDefaultText}
              status={state.status.key}
            />
          </TextsArea>
        </Form>
      </StyledColumn>
    </Wrapper>
  )
}

export default StatusForm
