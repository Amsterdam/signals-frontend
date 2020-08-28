import React, { useCallback, useState, useEffect, useMemo, useContext } from 'react';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import styled, { css } from 'styled-components';

import { Heading, themeSpacing, Row, Column, themeColor } from '@datapunt/asc-ui';
import { defaultTextsType } from 'shared/types';
import statusList, {
  changeStatusOptionList,
  defaultTextsOptionList,
} from 'signals/incident-management/definitions/statusList';

import Button from 'components/Button';
import Label from 'components/Label';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import RadioInput from '../../../../components/RadioInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import DefaultTexts from './components/DefaultTexts';
import CheckboxInput from './components/CheckboxInput';
import IncidentDetailContext from '../../context';
import { PATCH_TYPE_STATUS } from '../../constants';

export const MELDING_EXPLANATION = 'De melder ontvangt deze toelichting niet automatisch.';
export const DEELMELDING_EXPLANATION = 'De melder ontvangt deze toelichting niet.';
export const MELDING_CHECKBOX_DESCRIPTION =
  'Stuur deze toelichting naar de melder. Let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting.';

const CurrentStatus = styled.div`
  margin: ${themeSpacing(5, 0)};
`;

const Form = styled.form`
  position: relative;
  width: 100%;
  grid-template-areas:
    'header'
    'options'
    'texts'
    'form';
  grid-column-gap: 20px;
  display: grid;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    grid-template-columns: 6fr 6fr;
    grid-template-areas:
      'header texts'
      'options texts'
      'form texts'
      '. texts';
  }
`;

const HeaderArea = styled.div`
  grid-area: header;
`;

const OptionsArea = styled.div`
  grid-area: options;
`;

const TextsArea = styled.div`
  grid-area: texts;
  margin-top: ${themeSpacing(5)};
`;

const FormArea = styled.div`
  grid-area: form;
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
  margin-top: ${themeSpacing(5)};
`;

const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`;

const Notification = styled.div`
  ${({ warning }) =>
    warning &&
    css`
      border-left: 3px solid;
      display: block;
      margin: ${themeSpacing(8, 0)};
      padding-left: ${themeSpacing(5)};
      border-color: #ec0000;
    `}

  line-height: 22px;
`;

const Wrapper = styled(Row)`
  background-color: ${themeColor('tint', 'level1')};
  position: relative;
`;

const StyledColumn = styled(Column)`
  display: block;
  background-color: ${themeColor('tint', 'level1')};
  position: relative;
  margin-bottom: ${themeSpacing(3)};
`;

const canSendMail = status =>
  Boolean(changeStatusOptionList.find(({ can_send_email, key }) => can_send_email && status === key));

const StatusForm = ({ defaultTexts }) => {
  const { incident, update, close } = useContext(IncidentDetailContext);
  const currentStatus = statusList.find(({ key }) => key === incident.status.state);
  // disable submit button when the current status is a status that cannot be set manually (or, in other words, is not in the list of changeStatusOptionList)
  const [submitIsDisabled, setSubmitIsDisabled] = useState(
    changeStatusOptionList.find(({ key }) => key === currentStatus.key) === undefined
  );
  const [warning, setWarning] = useState('');
  const [showSendMail, setShowSendMail] = useState(canSendMail(currentStatus?.key));
  const isDeelmelding = !!incident?._links?.['sia:parent'];
  const form = useMemo(
    () =>
      FormBuilder.group({
        state: [incident.status.state, Validators.required],
        text: [''],
        send_email: [false],
      }),
    [incident.status]
  );

  useEffect(() => {
    form.controls.state.valueChanges.subscribe(status => {
      // reset the send_email field to make sure that a previously set value isn't accidentally sent to the API
      form.controls.send_email.value = false;

      const found = statusList.find(s => s.key === status);

      setSubmitIsDisabled(false);
      setShowSendMail(canSendMail(found?.key));
      setWarning(found?.warning);

      const hasDefaultTexts = Boolean(defaultTextsOptionList.find(s => s.key === status));

      if (hasDefaultTexts) {
        form.controls.text.setValidators([Validators.required]);
      } else {
        form.controls.text.clearValidators();
      }

      form.controls.text.updateValueAndValidity();
    });
  }, [form.controls.state.valueChanges, form.controls.text, form.controls.send_email]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (/{{|}}/gi.test(form.value.text)) {
        global.alert(
          "Er is een gereserveerd teken ('{{' of '}}') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan."
        );
      } else {
        update({
          type: PATCH_TYPE_STATUS,
          patch: {
            status: { state: form.value.state, text: form.value.text, send_email: form.value.send_email },
          },
        });

        close();
      }
    },
    [form.value, close, update]
  );

  const handleUseDefaultText = useCallback(
    (event, text) => {
      event.preventDefault();

      form.get('text').patchValue(text);
    },
    [form]
  );

  return (
    <Wrapper>
      <StyledColumn span={12}>
        <FieldGroup
          control={form}
          render={({ invalid }) => (
            <Form onSubmit={handleSubmit} data-testid="statusForm">
              <HeaderArea>
                <StyledH4 forwardedAs="h2">Status wijzigen</StyledH4>

                <CurrentStatus data-testid="currentStatus">
                  <Label as="span">Huidige status</Label>
                  <div>{currentStatus.value}</div>
                </CurrentStatus>
              </HeaderArea>

              <OptionsArea>
                <FieldControlWrapper
                  control={form.get('state')}
                  data-testid="statusFormStatusField"
                  name="status"
                  render={RadioInput}
                  values={changeStatusOptionList}
                />

                <Notification warning data-testid="statusFormWarning">
                  {warning}
                </Notification>
              </OptionsArea>

              <FormArea>
                <FieldControlWrapper
                  control={form.get('text')}
                  display="Toelichting"
                  name="text"
                  render={TextAreaInput}
                  rows={10}
                />

                {showSendMail && (
                  <React.Fragment>
                    <Notification warning data-testid="statusFormToelichting">
                      {isDeelmelding ? DEELMELDING_EXPLANATION : MELDING_EXPLANATION}
                    </Notification>

                    {!isDeelmelding && (
                      <FieldControlWrapper
                        control={form.get('send_email')}
                        data-testid="statusFormSendEmailField"
                        name="send_email"
                        label={MELDING_CHECKBOX_DESCRIPTION}
                        render={CheckboxInput}
                      />
                    )}
                  </React.Fragment>
                )}

                <StyledButton
                  data-testid="statusFormSubmitButton"
                  type="submit"
                  variant="secondary"
                  disabled={invalid || submitIsDisabled}
                >
                  Status opslaan
                </StyledButton>

                <StyledButton data-testid="statusFormCancelButton" variant="tertiary" onClick={close}>
                  Annuleren
                </StyledButton>
              </FormArea>

              <TextsArea>
                <DefaultTexts
                  defaultTexts={defaultTexts}
                  onHandleUseDefaultText={handleUseDefaultText}
                  status={form.get('state').value}
                />
              </TextsArea>
            </Form>
          )}
        />
      </StyledColumn>
    </Wrapper>
  );
};

StatusForm.propTypes = {
  defaultTexts: defaultTextsType.isRequired,
};

export default StatusForm;
