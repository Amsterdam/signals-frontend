import React, { useCallback } from 'react';

import PropTypes from 'prop-types';

import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import CONFIGURATION from 'shared/services/configuration/configuration';

import directingDepartmentList from 'signals/incident-management/definitions/directingDepartmentList';

import {
  StyledDefinitionList,
  StyledHeading,
  StyledTitle,
  StyledForm,
  StyledCancelButton,
  StyledSubmitButton,
} from './styled';

import RadioInput from './RadioInput';

import IncidentSplitFormIncident from './IncidentSplitFormIncident';

const IncidentSplitForm = ({ parentIncident, subcategories, onSubmit }) => {
  const { control, handleSubmit, register } = useForm();

  const history = useHistory();

  // is this useCallback required? when this action happens the page will be unmounted from dom...
  const onCancel = useCallback(() => { history.push(CONFIGURATION.INCIDENTS_ENDPOINT); }, [history]);

  const submit = formData => { onSubmit(formData); };

  return (
    <StyledForm onSubmit={handleSubmit(submit)} data-testid="incidentSplitForm">
      <StyledTitle forwardedAs="h2" styleAs="h2">Deelmelding maken</StyledTitle>

      <StyledHeading styleAs="h3">Hoofdmelding</StyledHeading>

      <StyledDefinitionList>
        <dt>Melding</dt>
        <dd data-testid="parentIncidentId">{parentIncident.id}</dd>

        <dt>Status</dt>
        <dd data-testid="statusDisplayName">{parentIncident.statusDisplayName}</dd>

        <dt>Subcategorie (verantwoordelijke afdeling)</dt>
        <dd data-testid="subcategoryDisplayName">{parentIncident.subcategoryDisplayName}</dd>
      </StyledDefinitionList>

      <RadioInput
        display="Regie"
        register={register}
        initialValue="null"
        name="department"
        id="department"
        data-testid="radioInputDepartment"
        options={directingDepartmentList}
      />

      <IncidentSplitFormIncident
        parentIncident={parentIncident}
        subcategories={subcategories}
        register={register}
        control={control}
      />

      <div>
        <StyledSubmitButton data-testid="incidentSplitFormSubmitButton" variant="secondary">
          Opslaan
        </StyledSubmitButton>

        <StyledCancelButton data-testid="incidentSplitFormCancelButton" variant="primaryInverted" onClick={onCancel}>
          Annuleren
        </StyledCancelButton>
      </div>
    </StyledForm>
  );
};

IncidentSplitForm.propTypes = {
  parentIncident: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    statusDisplayName: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
    subcategoryDisplayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      info: PropTypes.string,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default IncidentSplitForm;
