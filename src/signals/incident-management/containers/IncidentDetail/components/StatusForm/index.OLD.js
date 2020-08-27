import React, { Fragment, useCallback, useState, useEffect, useRef, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Heading, themeSpacing, Row, Column, themeColor, Label, ErrorMessage } from '@datapunt/asc-ui';

import { defaultTextsType } from 'shared/types';
import statusList, { changeStatusOptionList } from 'signals/incident-management/definitions/statusList';
import useFormValidation from 'hooks/useFormValidation';

import Button from 'components/Button';
import TextArea from 'components/TextArea';
import Checkbox from 'components/Checkbox';

import RadioButtonList from 'signals/incident-management/components/RadioButtonList';
import DefaultTexts from './components/DefaultTexts';
import IncidentDetailContext from '../../context';
import { PATCH_TYPE_STATUS } from '../../constants';

const HEROPENED_EXPLANATION = 'Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding.';
const AFGEHANDELD_EXPLANATION = `${HEROPENED_EXPLANATION} Gebruik deze status alleen als de melding ook echt is afgehandeld, gebruik anders de status Ingepland. Let op: als de huidige status “Verzoek tot heropenen” is, dan wordt er geen e-mail naar de melder gestuurd.`;
const GEANNULEERD_EXPLANATION =
  'Bij deze status wordt de melding afgesloten. Gebruik deze status alleen voor test- en nepmeldingen of meldingen van veelmelders.';
export const MELDING_CHECKBOX_DESCRIPTION =
  'Stuur deze toelichting naar de melder. Let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting.';
const DEELMELDING_EXPLANATION = 'De melder ontvangt deze toelichting niet.';

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
  margin-bottom: 5em;
  grid-row-gap: ${themeSpacing(4)};

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
  display: grid;
  grid-row-gap: ${themeSpacing(6)};
`;

const Notification = styled.div`
  ${({ warning }) =>
    warning &&
    css`
      border-left: 3px solid;
      display: block;
      padding-left: ${themeSpacing(5)};
      border-color: #ec0000;
    `}

  line-height: 22px;
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
  margin-top: ${themeSpacing(5)};
`;

const StyledErrorMessage = styled(ErrorMessage)`
  font-family: Avenir Next LT W01 Demi;
  font-weight: normal;
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

const StyledLabel = styled(Label)`
  align-items: baseline;
`;

const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`;

export const emailSentWhenStatusChangedTo = status =>
  Boolean(changeStatusOptionList.find(({ email_sent_when_set, key }) => email_sent_when_set && status === key));

const determineWarning = selectedStatusKey => {
  if (selectedStatusKey === 'reopened') {
    return HEROPENED_EXPLANATION;
  }

  if (selectedStatusKey === 'o') {
    return AFGEHANDELD_EXPLANATION;
  }

  if (selectedStatusKey === 'a') {
    return GEANNULEERD_EXPLANATION;
  }

  return '';
};

const StatusForm = ({ defaultTexts }) => {
  const { incident, update, close } = useContext(IncidentDetailContext);

  const currentStatus = statusList.find(({ key }) => key === incident.status.state);

  const formRef = useRef(null);

  const { validate, errors, event: submitEvent } = useFormValidation(formRef);

  const isDeelmelding = incident?._links?.['sia:parent'] !== undefined;
  const [status, setStatus] = useState(statusList.find(({ key }) => key === incident.status.state));
  const [checked, setChecked] = useState(emailSentWhenStatusChangedTo(status?.key));
  const [defaultText, setDefaultText] = useState('');
  const [warning, setWarning] = useState(determineWarning(status?.key));
  const [textRequired, setTextRequired] = useState(checked);
  const [checkboxIsDisabled, setCheckboxIsDisabled] = useState(emailSentWhenStatusChangedTo(currentStatus?.key));

  useEffect(() => {
    setTextRequired(checked);
  }, [checked, validate, submitEvent]);

  const onRadioChange = useCallback((name, selectedStatus) => {
    const found = statusList.find(s => s.key === selectedStatus.key);
    const disableCheckbox = emailSentWhenStatusChangedTo(found?.key);

    setStatus(selectedStatus);
    setCheckboxIsDisabled(disableCheckbox);
    setChecked(disableCheckbox);
    setWarning(determineWarning(selectedStatus.key));
    setTextRequired(disableCheckbox);
  }, []);

  const handleSubmit = useCallback(
    event => {
      event.persist();
      event.preventDefault();

      const { isValid } = validate(event);

      if (!isValid) return;

      const textElement = event.target.elements.text;
      const { value } = textElement;

      if (/{{|}}/gi.test(value)) {
        global.alert(
          "Er is een gereserveerd teken ('{{' of '}}') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan."
        );

        textElement.focus();
        textElement.setSelectionRange(value.indexOf('{{'), value.indexOf('}}') + 2);
      } else {
        const statusElement = event.target.elements.status;
        const sendEmailElement = event.target.elements.send_email;

        update({
          type: PATCH_TYPE_STATUS,
          patch: {
            status: { state: statusElement.value, text: value, send_email: sendEmailElement?.checked || false },
          },
        });

        close();
      }
    },
    [close, update, validate]
  );

  const handleUseDefaultText = useCallback((event, text) => {
    event.preventDefault();
    setDefaultText(text);
  }, []);

  const onTextChange = useCallback(() => {

  }, []);

  // const onCheck = useCallback(event => {
  //   setChecked(!checked);

  //   validate(event);/
  // }, [validate, checked]);

  return (
    <Wrapper>
      <StyledColumn span={12}>
        <Form onSubmit={handleSubmit} data-testid="statusForm" noValidate ref={formRef}>
          <HeaderArea>
            <StyledH4 forwardedAs="h2">Status wijzigen</StyledH4>

            <div data-testid="currentStatus">
              <Label as="strong" label="Huidige status" />
              <div>{currentStatus.value}</div>
            </div>
          </HeaderArea>

          <OptionsArea>
            <Label as="strong" htmlFor="status" label="Nieuwe status" />
            <input type="hidden" name="status" value={status.key} />
            <RadioButtonList
              defaultValue={status.key}
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
                    {!textRequired && <span>&nbsp;(optioneel)</span>}
                  </Fragment>
                }
              />
              <TextArea name="text" rows="4" required={textRequired} defaultValue={defaultText} error={errors.text} onChange={onTextChange} />

              {errors?.text && <StyledErrorMessage message={errors.text} />}
            </div>

            {warning && <Notification warning>{warning}</Notification>}

            {isDeelmelding && <Notification warning>{DEELMELDING_EXPLANATION}</Notification>}

            {!isDeelmelding && (
              <StyledLabel htmlFor="send_email" label={MELDING_CHECKBOX_DESCRIPTION} disabled={checkboxIsDisabled}>
                <Checkbox
                  checked={checked}
                  disabled={checkboxIsDisabled}
                  id="send_email"
                  name="send_email"
                  onClick={() => setChecked(!checked)}
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
              onHandleUseDefaultText={handleUseDefaultText}
              status={status.key}
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
