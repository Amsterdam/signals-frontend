import React, { Fragment, useCallback, useReducer, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Label, Alert, Heading, Paragraph } from '@amsterdam/asc-ui';

import { defaultTextsType } from 'shared/types';
import statusList, { changeStatusOptionList, isStatusClosed } from 'signals/incident-management/definitions/statusList';

import TextArea from 'components/TextArea';
import Checkbox from 'components/Checkbox';

import RadioButtonList from 'signals/incident-management/components/RadioButtonList';
import DefaultTexts from './components/DefaultTexts';
import IncidentDetailContext from '../../context';
import { PATCH_TYPE_STATUS } from '../../constants';
import {
  Form,
  FormArea,
  HeaderArea,
  Notification,
  OptionsArea,
  StyledButton,
  StyledColumn,
  StyledErrorMessage,
  StyledH4,
  StyledLabel,
  TextsArea,
  Wrapper,
} from './styled';
import * as constants from './constants';
import reducer, { init } from './reducer';

const StatusForm = ({ defaultTexts, childIncidents }) => {
  const { incident, update, close } = useContext(IncidentDetailContext);
  const [state, dispatch] = useReducer(reducer, incident, init);
  const isDeelmelding = useMemo(() => incident?._links?.['sia:parent'] !== undefined, [incident]);
  const currentStatus = useMemo(() => statusList.find(({ key }) => key === incident.status.state), [incident]);
  const hasOpenChildren = useMemo(
    () => childIncidents?.map(child => !isStatusClosed(child.status.state)).some(v => v === true),
    [childIncidents]
  );

  const onRadioChange = useCallback((name, selectedStatus) => {
    dispatch({ type: 'SET_STATUS', payload: selectedStatus });
  }, []);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      const textValue = state.text.value || state.text.defaultValue;

      if (state.text.required && !textValue) {
        dispatch({ type: 'SET_ERRORS', payload: { text: 'Dit veld is verplicht' } });
        return;
      }

      if (/{{|}}/gi.test(textValue)) {
        dispatch({
          type: 'SET_ERRORS',
          payload: {
            text:
              "Er is een gereserveerd teken ('{{' of '}}') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan.",
          },
        });
        return;
      }

      update({
        type: PATCH_TYPE_STATUS,
        patch: {
          status: { state: state.status.key, text: textValue, send_email: state.check.checked },
        },
      });

      close();
    },
    [close, update, state.text, state.check.checked, state.status.key]
  );

  const setDefaultText = useCallback((event, text) => {
    dispatch({ type: 'SET_DEFAULT_TEXT', payload: text });
  }, []);

  const onCheck = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHECK' });
  }, []);

  const onTextChange = useCallback(event => {
    dispatch({ type: 'SET_TEXT', payload: event.target.value });
  }, []);

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
                <Heading forwardedAs="h3">{constants.DEELMELDINGEN_STILL_OPEN_HEADING}</Heading>
                <Paragraph>{constants.DEELMELDINGEN_STILL_OPEN_CONTENT}</Paragraph>
              </Alert>
            )}

            {isDeelmelding && (
              <Alert data-testid="statusExplanation" level="info">{constants.DEELMELDING_EXPLANATION}</Alert>
            )}
          </OptionsArea>

          <FormArea>
            <div>
              <Label
                as="span"
                htmlFor="status"
                label={
                  <Fragment>
                    <strong>Toelichting</strong>
                    {!state.text.required && <span>&nbsp;(optioneel)</span>}
                  </Fragment>
                }
              />
              <TextArea
                data-testid="text"
                error={state.errors?.text}
                name="text"
                onChange={onTextChange}
                required={state.text.required}
                rows="4"
                value={state.text.value || state.text.defaultValue}
              />

              {state.errors?.text && <StyledErrorMessage data-testid="statusError" message={state.errors.text} />}
            </div>

            {state.warning && (
              <Notification warning data-testid="statusWarning">
                {state.warning}
              </Notification>
            )}

            {!isDeelmelding && (
              <StyledLabel
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
              </StyledLabel>
            )}

            <div>
              <StyledButton data-testid="statusFormSubmitButton" type="submit" variant="secondary">
                Status opslaan
              </StyledButton>

              <StyledButton data-testid="statusFormCancelButton" variant="tertiary" onClick={close}>
                Annuleren
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
  );
};

StatusForm.propTypes = {
  defaultTexts: defaultTextsType.isRequired,
  childIncidents: PropTypes.arrayOf(PropTypes.shape({})),
};

export default StatusForm;
