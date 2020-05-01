import React, { Fragment, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';
import styled, { css } from 'styled-components';

import { Button, Heading, Row, Column, themeSpacing } from '@datapunt/asc-ui';
import { incidentType, defaultTextsType } from 'shared/types';
import { PATCH_TYPE_STATUS } from 'models/incident/constants';
import statusList, {
  defaultTextsOptionList,
  changeStatusOptionList,
} from 'signals/incident-management/definitions/statusList';

import Label from 'components/Label';
import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import RadioInput from '../../../../components/RadioInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import DefaultTexts from './components/DefaultTexts';
import CloseButton from '../CloseButton';

const Form = styled.form`
  position: relative;
`;

const StyledColumn = styled(Column)`
  display: block;
  background: white;
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
  margin-top: ${themeSpacing(5)};
`;

const StyledCurrentStatus = styled.div`
  margin-bottom: ${themeSpacing(5)};
`;

const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
  font-family: AvenirNextLTW01-Regular, arial, sans-serif;
  font-weight: 700;
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

const form = FormBuilder.group({
  status: ['', Validators.required],
  text: [''],
});

const StatusForm = ({ defaultTexts, error, incident, onClose, onPatchIncident }) => {
  const currentStatus = statusList.find(({ key }) => key === incident.status.state);
  const [warning, setWarning] = useState('');
  const [patchError, setPatchError] = useState();

  useEffect(() => {
    setPatchError('');

    form.controls.status.valueChanges.subscribe(status => {
      const found = statusList.find(s => s.key === status);

      setWarning(found?.warning);

      const textField = form.controls.text;
      const hasDefaultTexts = Boolean(defaultTextsOptionList.find(s => s.key === status));

      if (hasDefaultTexts) {
        textField.setValidators([Validators.required]);
      } else {
        textField.clearValidators();
      }

      textField.updateValueAndValidity();
    });
  }, []);

  useEffect(() => {
    if (!error) {
      setPatchError('');
      return;
    }

    const message =
      error?.status === 403
        ? 'Je bent niet geautoriseerd om dit te doen.'
        : 'De gekozen status is niet mogelijk in deze situatie.';

    setPatchError(message);
  }, [error]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (/(?:{{|}})/gi.test(form.value.text)) {
        global.alert(
          "Er is een gereserveerd teken ('{{' of '}}') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan."
        );
      } else {
        onPatchIncident({
          id: incident.id,
          type: PATCH_TYPE_STATUS,
          patch: {
            status: { state: form.value.status, text: form.value.text },
          },
        });
      }
    },
    [incident.id, onPatchIncident]
  );

  const handleUseDefaultText = useCallback((event, text) => {
    event.preventDefault();

    form.get('text').patchValue(text);
  }, []);

  return (
    <Fragment>
      <FieldGroup
        control={form}
        render={() => (
          <Form onSubmit={handleSubmit}>
            <CloseButton onClick={onClose} />

            <Row>
              <StyledColumn span={{ small: 2, medium: 2, big: 5, large: 6, xLarge: 6 }}>
                <StyledH4 $as="h4">Status wijzigen</StyledH4>

                <StyledCurrentStatus>
                  <Label htmlFor="currentStatus">Huidige status</Label>
                  <div id="currentStatus">{currentStatus.value}</div>
                </StyledCurrentStatus>

                <FieldControlWrapper
                  control={form.get('status')}
                  data-testid="statusFormStatusField"
                  display="Nieuwe status"
                  name="status"
                  render={RadioInput}
                  values={changeStatusOptionList}
                />
              </StyledColumn>

              <StyledColumn span={{ small: 2, medium: 2, big: 5, large: 6, xLarge: 6 }}>
                <DefaultTexts
                  defaultTexts={defaultTexts}
                  onHandleUseDefaultText={handleUseDefaultText}
                  status={form.get('status').value}
                />
              </StyledColumn>
            </Row>

            <Row>
              <StyledColumn span={12}>
                <FieldControlWrapper
                  control={form.get('text')}
                  display="Toelichting"
                  name="text"
                  render={TextAreaInput}
                  rows={10}
                />

                <Notification warning data-testid="statusFormWarning">
                  {warning}
                </Notification>

                {patchError && (
                  <Notification warning data-testid="statusFormError">
                    {patchError}
                  </Notification>
                )}

                <StyledButton data-testid="statusFormSubmitButton" type="submit" variant="secondary">
                  Status opslaan
                </StyledButton>

                <StyledButton data-testid="statusFormCancelButton" variant="tertiary" onClick={onClose}>
                  Annuleren
                </StyledButton>
              </StyledColumn>
            </Row>
          </Form>
        )}
      />
    </Fragment>
  );
};

StatusForm.propTypes = {
  defaultTexts: defaultTextsType.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  incident: incidentType.isRequired,
  onClose: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
};

export default StatusForm;
