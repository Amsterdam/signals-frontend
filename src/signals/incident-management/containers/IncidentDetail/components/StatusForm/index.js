import React, { useCallback, useState, useEffect, useMemo, useContext } from 'react';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import styled, { css } from 'styled-components';

import { Heading, themeSpacing, Row, Column } from '@datapunt/asc-ui';
import { defaultTextsType } from 'shared/types';
import statusList, {
  defaultTextsOptionList,
  changeStatusOptionList,
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
  'Stuur deze toelichting naar de melder. Let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting';

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
      'header header'
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
      margin: 30px 0;
      padding-left: 20px;
      border-color: #ec0000;
    `}

  line-height: 22px;
`;

const Wrapper = styled(Row)`
  padding-top: 20px;
  position: relative;
`;

const StyledColumn = styled(Column)`
  display: block;
  background: white;
  position: relative;
`;

// Don't show the send email checkbox for statuses ingepland, hreopend, afgehandeld and geannuleerd
const canSendMail = status => !['ingepland', 'reopened', 'o', 'a'].includes(status);

const StatusForm = ({ defaultTexts }) => {
  const { incident, update, close } = useContext(IncidentDetailContext);
  const currentStatus = statusList.find(({ key }) => key === incident.status.state);
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
      const found = statusList.find(s => s.key === status);

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
  }, [form.controls.state.valueChanges, form.controls.text]);

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

                {showSendMail && (<React.Fragment>
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
                  )}</React.Fragment>
                )
                }

                <StyledButton data-testid="statusFormSubmitButton" type="submit" variant="secondary" disabled={invalid}>
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
