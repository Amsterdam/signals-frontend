import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
// import { Row, Column } from '@datapunt/asc-ui';

import directingDepartmentList from 'signals/incident-management/definitions/directingDepartmentList';

import { DefinitionList, StyledBorderBottomWrapper, StyledButton, StyledSubmitButton, Title } from './styled';

import RadioInput from './RadioInput';

import IncidentSplitFormIncident from './IncidentSplitFormIncident';

const IncidentSplitForm = ({ parentIncident, onSubmit }) => {
  const { register, handleSubmit, control } = useForm();

  if (!parentIncident) return <h1>Hoofdmelding niet gevonden</h1>;

  return (
    <Fragment>
      <Title forwardedAs="h2" styleAs="h2">Deelmelding maken</Title>

      <Title forwardedAs="h2" styleAs="h4">Hoofdmelding</Title>

      <DefinitionList>
        <dt>Melding</dt>
        <dd>{parentIncident.id}</dd>

        <dt>Status</dt>
        <dd>{parentIncident.statusDisplayName}</dd>

        <dt>Subcategorie (verantwoordelijke afdeling)</dt>
        <dd>{parentIncident.subcategoryDisplayName}</dd>
      </DefinitionList>

      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledBorderBottomWrapper>
          <RadioInput
            display="Regie"
            register={register}
            initialValue="null"
            name="department"
            id="department"
            options={directingDepartmentList}
          />
        </StyledBorderBottomWrapper>

        <IncidentSplitFormIncident parentIncident={parentIncident} register={register} control={control} />

        <StyledSubmitButton data-testid="splitFormSubmit" variant="secondary">Opslaan</StyledSubmitButton>

        <StyledButton
          data-testid="splitFormCancel"
          variant="primaryInverted"
          onClick={() => { console.warn('`goBack` is not implemented yet (in IncidentSplitContainer)'); }}
        >
          Annuleren
        </StyledButton>
      </form>
    </Fragment>
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
  onSubmit: PropTypes.func.isRequired,
};

export default IncidentSplitForm;
