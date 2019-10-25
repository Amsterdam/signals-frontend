import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormBuilder, FieldGroup, Validators } from 'react-reactive-form';

import { Button, Spinner, Heading, Row, Column } from '@datapunt/asc-ui';
import { incidentType, dataListType, defaultTextsType } from 'shared/types';

import FieldControlWrapper from '../../../../components/FieldControlWrapper';
import RadioInput from '../../../../components/RadioInput';
import TextAreaInput from '../../../../components/TextAreaInput';
import Label from '../../../../components/Label';
import DefaultTexts from './components/DefaultTexts';

const form = FormBuilder.group({
  status: ['o', Validators.required],
  text: [''],
});

const StyledColumn = styled(Column)`
  display: block;
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-top: 20px;
  margin-bottom: 8px;
`;

const StyledCurrentStatus = styled.div`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
`;

const StatusForm = ({
  incident,
  patching,
  error,
  statusList,
  changeStatusOptionList,
  defaultTextsOptionList,
  defaultTexts,
  onPatchIncident,
  onDismissError,
  onClose,
}) => {
  const [warning, setWarning] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasDefaultTexts , setHasDefaultTexts] = useState(false);

  const reset = () => {
    form.patchValue({status: '', text: '' });
  };

  useEffect(() => {
    form.controls.status.valueChanges.subscribe(status => {
      const found = statusList.find(s => s.key === status);
      setWarning((found && found.warning) || '');
      onDismissError();

      const textField = form.controls.text;
      const hasfound = defaultTextsOptionList.find(s => s.key === status);
      if (hasfound) {
        setHasDefaultTexts(true);
        textField.setValidators([Validators.required]);
      } else {
        setHasDefaultTexts(false);
        textField.clearValidators();
      }

      textField.updateValueAndValidity();
    });

    onDismissError();
    form.updateValueAndValidity();
  }, []);

  useEffect(() => {
    const hasError = (error && error.response && !error.response.ok) || false;
    const textField = form.controls.text;
    if (submitting && patching.status === false) {
      setSubmitting(false);
      if (!hasError) {
        textField.clearValidators();
        reset();
        onClose();
      }
    }

    form.updateValueAndValidity();
  }, [patching.status, error.response]);

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitting(true);
    onPatchIncident({
      id: incident.id,
      type: 'status',
      patch: {
        status: {
          state: form.value.status,
          text: form.value.text,
        },
      },
    });
  }

  const handleUseDefaultText = (e, text) => {
    e.preventDefault();

    form.get('text').patchValue(text);
  };

  const currentStatus = statusList.find(status => status.key === incident.status.state);
  return (
    <Fragment>
      <FieldGroup
        control={form}
        render={({ invalid }) => (
          <form onSubmit={handleSubmit}>
            <Row>
              <StyledColumn span={6}>
                <StyledH4 $as="h4">Status wijzigen</StyledH4>

                <StyledCurrentStatus>
                  <Label htmlFor="currentStatus">Huidige status</Label>
                  <div id="currentStatus">{currentStatus.value}</div>
                </StyledCurrentStatus>

                <FieldControlWrapper
                  display="Nieuwe status"
                  render={RadioInput}
                  name="status"
                  className="status-form__form-status"
                  control={form.get('status')}
                  values={changeStatusOptionList}
                />
                <FieldControlWrapper
                  render={TextAreaInput}
                  name="text"
                  className="status-form__form-text"
                  display="Toelichting"
                  control={form.get('text')}
                  rows={5}
                />

                <div className="status-form__warning notification notification-red">
                  {warning}
                </div>
                <div className="status-form__error notification notification-red">
                  {error && error.response && error.response.status === 403 ? 'Je bent niet geautoriseerd om dit te doen.' : '' }
                  {error && error.response && error.response.status !== 403 ? 'De gekozen status is niet mogelijk in deze situatie.' : '' }
                </div>

                <StyledButton
                  variant="secondary"
                  disabled={invalid}
                  type="submit"
                  iconRight={patching.status ? <Spinner /> : null}
                >Status opslaan</StyledButton>
                <StyledButton
                  variant="tertiary"
                >Annuleren</StyledButton>
              </StyledColumn>
              <StyledColumn span={6}>
                <DefaultTexts
                  defaultTexts={defaultTexts}
                  status={form.get('status').value}
                  hasDefaultTexts={hasDefaultTexts}
                  onHandleUseDefaultText={handleUseDefaultText}
                />
              </StyledColumn>
            </Row>
          </form>
        )}
      />

    </Fragment>
  );
  ;
};

StatusForm.propTypes = {
  incident: incidentType.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  patching: PropTypes.shape({
    status: PropTypes.bool,
  }).isRequired,
  changeStatusOptionList: dataListType.isRequired,
  defaultTextsOptionList: dataListType.isRequired,
  statusList: dataListType.isRequired,
  defaultTexts: defaultTextsType.isRequired,

  onPatchIncident: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatusForm;
