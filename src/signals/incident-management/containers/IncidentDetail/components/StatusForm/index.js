import React, { useCallback, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';

import { Heading, themeSpacing } from '@datapunt/asc-ui';
import { incidentType, defaultTextsType } from 'shared/types';
import { PATCH_TYPE_STATUS } from 'models/incident/constants';
import statusList, {
  defaultTextsOptionList,
  changeStatusOptionList,
} from 'signals/incident-management/definitions/statusList';
import { patchIncident } from 'models/incident/actions';

import Button from 'components/Button';
import Label from 'components/Label';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import RadioInput from '../../../../components/RadioInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import DefaultTexts from './components/DefaultTexts';
import CheckboxInput from './components/CheckboxInput';

const MELDING_EXPLANATION = 'De melder ontvangt deze toelichting niet automatisch.';
const DEELMELDING_EXPLANATION = 'De melder ontvangt deze toelichting niet.';
const MELDING_CHECKBOX_DESCRIPTION =
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

const StatusForm = ({ defaultTexts, incident, onClose }) => {
  const currentStatus = statusList.find(status => status.key === incident.status.state);
  const [warning, setWarning] = useState('');
  const dispatch = useDispatch();
  const isDeelmelding = !!incident?._links?.['sia:parent'];

  const form = useMemo(
    () =>
      FormBuilder.group({
        status: [incident.status.state, Validators.required],
        text: [''],
        send_email: [false],
      }),
    [incident.status.state]
  );

  useEffect(() => {
    form.controls.status.valueChanges.subscribe(status => {
      const found = statusList.find(s => s.key === status);

      setWarning(found?.warning);

      const hasDefaultTexts = Boolean(defaultTextsOptionList.find(s => s.key === status));

      if (hasDefaultTexts) {
        form.controls.text.setValidators([Validators.required]);
      } else {
        form.controls.text.clearValidators();
      }

      form.controls.text.updateValueAndValidity();
    });
  }, [form.controls.status.valueChanges, form.controls.text, form.controls.send_email.valueChanges]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (/{{|}}/gi.test(form.value.text)) {
        global.alert(
          "Er is een gereserveerd teken ('{{' of '}}') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan."
        );
      } else {
        dispatch(
          patchIncident({
            id: incident.id,
            type: PATCH_TYPE_STATUS,
            patch: {
              status: { state: form.value.status, text: form.value.text, send_email: form.value.send_email },
            },
          })
        );

        onClose();
      }
    },
    [incident.id, form.value.status, form.value.text, form.value.send_email, onClose, dispatch]
  );

  const handleUseDefaultText = useCallback(
    (event, text) => {
      event.preventDefault();

      form.get('text').patchValue(text);
    },
    [form]
  );

  return (
    <FieldGroup
      control={form}
      render={({ invalid }) => (
        <Form onSubmit={handleSubmit}>
          <HeaderArea>
            <StyledH4 forwardedAs="h2">Status wijzigen</StyledH4>

            <CurrentStatus data-testid="currentStatus">
              <Label as="span">Huidige status</Label>
              <div>{currentStatus.value}</div>
            </CurrentStatus>
          </HeaderArea>

          <OptionsArea>
            <FieldControlWrapper
              control={form.get('status')}
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

            <StyledButton data-testid="statusFormSubmitButton" type="submit" variant="secondary" disabled={invalid}>
              Status opslaan
            </StyledButton>

            <StyledButton data-testid="statusFormCancelButton" variant="tertiary" onClick={onClose}>
              Annuleren
            </StyledButton>
          </FormArea>

          <TextsArea>
            <DefaultTexts
              defaultTexts={defaultTexts}
              onHandleUseDefaultText={handleUseDefaultText}
              status={form.get('status').value}
            />
          </TextsArea>
        </Form>
      )}
    />
  );
};

StatusForm.propTypes = {
  defaultTexts: defaultTextsType.isRequired,
  incident: incidentType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatusForm;
