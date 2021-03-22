import React, { useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { Heading, themeSpacing } from '@amsterdam/asc-ui';

import { directingDepartmentsType } from 'shared/types';

import Button from 'components/Button';
import TextArea from 'components/TextArea';

import { StyledDefinitionList, StyledForm, StyledSubmitButton, FormWrapper } from '../../styled';

import IncidentSplitFormIncident from '../IncidentSplitFormIncident';
import IncidentSplitRadioInput from '../IncidentSplitRadioInput';

export const StyledIncidentSplitRadioInput = styled(IncidentSplitRadioInput)`
  padding-bottom: ${themeSpacing(6)};
`;

const IncidentSplitForm = ({ parentIncident, subcategories, directingDepartments, onSubmit, isSubmitting }) => {
  const { handleSubmit, register } = useForm();

  const history = useHistory();

  const onCancel = useCallback(() => {
    history.push(`/manage/incident/${parentIncident.id}`);
  }, [history, parentIncident.id]);

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

          <StyledIncidentSplitRadioInput
            display="Regie"
            register={register}
            initialValue={parentIncident.directingDepartment}
            name="department"
            id="department"
            data-testid="incidentSplitFormRadioInputDepartment"
            options={directingDepartments}
          />

          <TextArea
            label={
              <Fragment>
                <strong>Notitie</strong> (Niet verplicht)
              </Fragment>
            }
            rows={7}
            ref={register}
            name="noteText"
            id="noteText"
            data-testid="incidentSplitFormParentIncidentNote"
          />
        </fieldset>

        <IncidentSplitFormIncident parentIncident={parentIncident} subcategories={subcategories} register={register} />

        <div>
          <StyledSubmitButton data-testid="incidentSplitFormSubmitButton" variant="secondary" disabled={isSubmitting}>
            Opslaan
          </StyledSubmitButton>

          <Button data-testid="incidentSplitFormCancelButton" variant="tertiary" onClick={onCancel} disabled={isSubmitting}>
            Annuleren
          </Button>
        </div>
      </StyledForm>
    </FormWrapper>
  );
};

IncidentSplitForm.propTypes = {
  parentIncident: PropTypes.shape({
    id: PropTypes.number.isRequired,
    childrenCount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    statusDisplayName: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
    subcategoryDisplayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    directingDepartment: PropTypes.string.isRequired,
  }).isRequired,
  subcategories: PropTypes.array.isRequired,
  directingDepartments: directingDepartmentsType.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default IncidentSplitForm;
