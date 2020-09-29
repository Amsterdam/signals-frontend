import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Heading } from '@datapunt/asc-ui';

import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { subcategoriesType } from 'shared/types';

import CONFIGURATION from 'shared/services/configuration/configuration';

import directingDepartmentList from 'signals/incident-management/definitions/directingDepartmentList';
import Button from 'components/Button';

import {
  StyledDefinitionList,
  StyledTitle,
  StyledForm,
  StyledSubmitButton,
  FormWrapper,
} from './styled';

import IncidentSplitRadioInput from './IncidentSplitRadioInput';

import IncidentSplitFormIncident from './IncidentSplitFormIncident';

const IncidentSplitForm = ({ parentIncident, subcategories, onSubmit }) => {
  const { control, handleSubmit, register } = useForm();

  const history = useHistory();

  const onCancel = useCallback(() => {
    history.push(CONFIGURATION.INCIDENTS_ENDPOINT);
  }, [history]);

  return (
    <FormWrapper>
      <StyledForm onSubmit={handleSubmit(data => onSubmit(data))} data-testid="incidentSplitForm">
        <StyledTitle>
          Deelmelding maken
        </StyledTitle>

        <fieldset>
          <Heading forwardedAs="h2">Hoofdmelding</Heading>

          <StyledDefinitionList>
            <dt>Melding</dt>
            <dd data-testid="parentIncidentId">{parentIncident.id}</dd>

            <dt>Status</dt>
            <dd data-testid="statusDisplayName">{parentIncident.statusDisplayName}</dd>

            <dt>Subcategorie (verantwoordelijke afdeling)</dt>
            <dd data-testid="subcategoryDisplayName">{parentIncident.subcategoryDisplayName}</dd>
          </StyledDefinitionList>

          <IncidentSplitRadioInput
            display="Regie"
            register={register}
            initialValue="null"
            name="department"
            id="department"
            data-testid="radioInputDepartment"
            options={directingDepartmentList}
          />
        </fieldset>

        <IncidentSplitFormIncident
          parentIncident={parentIncident}
          subcategories={subcategories}
          register={register}
          control={control}
        />

        <fieldset>
          <StyledSubmitButton data-testid="incidentSplitFormSubmitButton" variant="secondary">
            Opslaan
          </StyledSubmitButton>

          <Button data-testid="incidentSplitFormCancelButton" variant="primaryInverted" onClick={onCancel}>
            Annuleren
          </Button>
        </fieldset>
      </StyledForm>
    </FormWrapper>
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
  subcategories: subcategoriesType.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default IncidentSplitForm;
