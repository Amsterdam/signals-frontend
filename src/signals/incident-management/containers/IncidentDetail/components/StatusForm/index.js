// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useCallback, useReducer, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Label, Alert, Heading } from '@amsterdam/asc-ui'

import { defaultTextsType } from 'shared/types'
import statusList, {
  changeStatusOptionList,
  isStatusClosed,
} from 'signals/incident-management/definitions/statusList'

import Paragraph from 'components/Paragraph'
import TextArea from 'components/TextArea'
import Checkbox from 'components/Checkbox'

import RadioButtonList from 'signals/incident-management/components/RadioButtonList'
import IncidentDetailContext from '../../context'
import { PATCH_TYPE_STATUS } from '../../constants'
import DefaultTexts from './components/DefaultTexts'
import {
  Form,
  FormArea,
  HeaderArea,
  OptionsArea,
  QuestionLabel,
  StyledButton,
  StyledColumn,
  StyledH4,
  TextsArea,
  Wrapper,
} from './styled'
import * as constants from './constants'
import reducer, { init } from './reducer'

const StatusForm = ({ defaultTexts, childIncidents, hasEmail }) => {
  const { incident, update, close } = useContext(IncidentDetailContext)
  const [state, dispatch] = useReducer(reducer, incident, init)
  const currentStatus = useMemo(
    () => statusList.find(({ key }) => key === incident.status.state),
    [incident]
  )
  const hasOpenChildren = useMemo(
    () =>
      childIncidents
        ?.map((child) => !isStatusClosed(child.status.state))
        .some((v) => v === true),
    [childIncidents]
  )

  const onRadioChange = useCallback((name, selectedStatus) => {
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

      if (textValue.length > constants.DEFAULT_MESSAGE_MAX_LENGTH) {
        dispatch({
          type: 'SET_ERRORS',
          payload: {
            text: `Je hebt meer dan de maximale ${constants.DEFAULT_MESSAGE_MAX_LENGTH} tekens ingevoerd.`,
          },
        })
        return
      }

      if (/{{|}}/gi.test(textValue)) {
        dispatch({
          type: 'SET_ERRORS',
          payload: {
            text: "Er is een gereserveerd teken ('{{' of '}}') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan.",
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
    [close, update, state.text, state.check.checked, state.status.key]
  )

  const setDefaultText = useCallback((event, text) => {
    dispatch({ type: 'SET_DEFAULT_TEXT', payload: text })
  }, [])

  const onCheck = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHECK' })
  }, [])

  const onTextChange = useCallback((event) => {
    dispatch({ type: 'SET_TEXT', payload: event.target.value })
  }, [])

  return (
    <Wrapper>
      <StyledColumn span={12}>
        <Form onSubmit={handleSubmit} data-testid="statusForm" noValidate>
          <HeaderArea>
            <StyledH4 forwardedAs="h2">Status wijzigen</StyledH4>

            <div data-testid="currentStatus">
              <Label as="strong" label="Huidige status" />
              <div>{currentStatus.value}</div>
            </div>
          </HeaderArea>

          <OptionsArea>
            <div>
              <Label as="strong" htmlFor="status" label="Nieuwe status" />
              <input type="hidden" name="status" value={currentStatus.key} />
              <RadioButtonList
                defaultValue={state.status.key}
                groupName="status"
                hasEmptySelectionButton={false}
                name="status"
                onChange={onRadioChange}
                options={changeStatusOptionList}
              />
            </div>

            {isStatusClosed(state.status.key) && hasOpenChildren && (
              <Alert level="info" data-testid="statusHasChildrenOpen">
                <Heading forwardedAs="h3">
                  {constants.DEELMELDINGEN_STILL_OPEN_HEADING}
                </Heading>
                <Paragraph>
                  {constants.DEELMELDINGEN_STILL_OPEN_CONTENT}
                </Paragraph>
              </Alert>
            )}

            {state.isSplitIncident && (
              <Alert data-testid="statusExplanation" level="info">
                {constants.DEELMELDING_EXPLANATION}
              </Alert>
            )}
          </OptionsArea>

          <FormArea>
            {state.warning && (
              <Alert data-testid="statusWarning">{state.warning}</Alert>
            )}

            {!state.isSplitIncident && (
              <div>
                <QuestionLabel>
                  <strong>Versturen</strong>
                </QuestionLabel>

                {hasEmail ? (
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
                      name="send_email"
                      onClick={onCheck}
                    />
                  </Label>
                ) : (
                  <Alert>{constants.NO_REPORTER_EMAIL}</Alert>
                )}
              </div>
            )}

            <div>
              <QuestionLabel>
                <strong>Toelichting</strong>
                {!state.text.required && <span>&nbsp;(niet verplicht)</span>}
                {state.text.required && state.check.checked && (
                  <Paragraph light>{constants.MAIL_EXPLANATION}</Paragraph>
                )}
              </QuestionLabel>
              <TextArea
                data-testid="text"
                error={Boolean(state.errors?.text)}
                errorMessage={state.errors?.text}
                infoText={`${state.text.value.length}/${constants.DEFAULT_MESSAGE_MAX_LENGTH} tekens`}
                name="text"
                onChange={onTextChange}
                required={state.text.required}
                rows="9"
                value={state.text.value || state.text.defaultValue}
              />
            </div>

            <div>
              <StyledButton
                data-testid="statusFormSubmitButton"
                type="submit"
                variant="secondary"
              >
                Status opslaan
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

StatusForm.propTypes = {
  defaultTexts: defaultTextsType.isRequired,
  childIncidents: PropTypes.arrayOf(PropTypes.shape({})),
  hasEmail: PropTypes.bool,
}

export default StatusForm
