import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { Button, Heading } from '@datapunt/asc-ui';

import { subcategoriesType } from 'shared/types';

import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  StyledDefinitionList,
  StyledForm,
  StyledSubmitButton,
  FormWrapper,
} from '../styled';

import IncidentSplitFormIncident from '../IncidentSplitFormIncident';

const IncidentSplitForm = ({ parentIncident, subcategories, onSubmit }) => {
  const { control, handleSubmit, register } = useForm();

  const history = useHistory();

  const onCancel = useCallback(() => {
    history.push(CONFIGURATION.INCIDENTS_ENDPOINT);
  }, [history]);

  return (
    <FormWrapper>
      <StyledForm onSubmit={handleSubmit(data => onSubmit(data))} data-testid="incidentSplitForm">
        <Heading>Deelmelding maken</Heading>

        <fieldset>
          <Heading forwardedAs="h2">Hoofdmelding</Heading>

          <StyledDefinitionList>
            <dt>Melding</dt>
            <dd data-testid="incidentSplitFormParentIncidentId">{parentIncident.id}</dd>

            <dt>Status</dt>
            <dd data-testid="incidentSplitFormStatusDisplayName">{parentIncident.statusDisplayName}</dd>

            <dt>Subcategorie (verantwoordelijke afdeling)</dt>
            <dd data-testid="incidentSplitFormSubcategoryDisplayName">{parentIncident.subcategoryDisplayName}</dd>
          </StyledDefinitionList>

          {/*
          can be uncommented as soon as SIG-2473 is picked up

          <IncidentSplitRadioInput
            display="Regie"
            register={register}
            initialValue="null"
            name="department"
            id="department"
            data-testid="incidentSplitFormRadioInputDepartment"
            options={directingDepartmentList}
          />
          */}
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
