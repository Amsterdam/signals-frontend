import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import directingDepartmentList from 'signals/incident-management/definitions/directingDepartmentList';

import {
  StyledDefinitionList,
  StyledBorderBottomWrapper,
  StyledButton,
  StyledForm,
  StyledHeading,
  StyledSubmitButton,
  StyledTitle,
} from './styled';

import RadioInput from './RadioInput';

import IncidentSplitFormIncident from './IncidentSplitFormIncident';

const IncidentSplitForm = ({ parentIncident, subcategories, onSubmit }) => {
  const { register, handleSubmit, control } = useForm();

  return (
    <StyledForm>
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledBorderBottomWrapper>
          <RadioInput
            display="Regie"
            register={register}
            initialValue="null"
            name="department"
            id="department"
            data-testid="radioInputDepartment"
            options={directingDepartmentList}
          />
        </StyledBorderBottomWrapper>

        <IncidentSplitFormIncident
          parentIncident={parentIncident}
          subcategories={subcategories}
          register={register}
          control={control}
        />

        <StyledSubmitButton data-testid="incidentSplitFormSubmit" variant="secondary">Opslaan</StyledSubmitButton>

        <StyledButton
          data-testid="incidentSplitFormCancel"
          variant="primaryInverted"
          onClick={() => { console.warn('`goBack` is not implemented yet (in IncidentSplitContainer)'); }}
        >
          Annuleren
        </StyledButton>
      </form>
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
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      info: PropTypes.string,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
};

export default IncidentSplitForm;
