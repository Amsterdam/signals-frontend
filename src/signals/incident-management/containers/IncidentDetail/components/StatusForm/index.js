import React, { Fragment, useCallback, useReducer, useContext } from 'react';
import { Label } from '@datapunt/asc-ui';

import { defaultTextsType } from 'shared/types';
import statusList, { changeStatusOptionList } from 'signals/incident-management/definitions/statusList';

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

const StatusForm = ({ defaultTexts }) => {
  const { incident, update, close } = useContext(IncidentDetailContext);
  const [state, dispatch] = useReducer(reducer, incident, init);
  const isDeelmelding = incident?._links?.['sia:parent'] !== undefined;
  const currentStatus = statusList.find(({ key }) => key === incident.status.state);

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

            {state.warning && <Notification warning data-testid="statusWarning">{state.warning}</Notification>}

            {isDeelmelding && <Notification warning data-testid="statusExplanation">{constants.DEELMELDING_EXPLANATION}</Notification>}

            {!isDeelmelding && (
              <StyledLabel
                disabled={state.check.disabled}
                htmlFor="send_email"
                label={constants.MELDING_CHECKBOX_DESCRIPTION}
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
};

export default StatusForm;
