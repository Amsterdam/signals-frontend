import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';

import { DefinitionList, Title } from './styled';

import IncidentSplitFormIncident from './IncidentSplitFormIncident';

const IncidentSplitForm = ({ parentIncident, onSubmit }) => {
  if (!parentIncident) return <h1>Hoofdmelding niet gevonden</h1>;

  return (
    <Fragment>
      <Title data-testid="detail-title" forwardedAs="h2" styleAs="h4">Hoofdmelding</Title>

      <DefinitionList>
        <dt>Melding</dt>
        <dd>{parentIncident.id}</dd>

        <dt>Status</dt>
        <dd>{parentIncident.statusDisplayName}</dd>

        <dt>Subcategorie (verantwoordelijke afdeling)</dt>
        <dd>{parentIncident.subcategoryDisplayName}</dd>
      </DefinitionList>

      <IncidentSplitFormIncident parentIncident={parentIncident} onSubmit={onSubmit} />
    </Fragment>
  );
};

// IncidentSplitForm.propTypes = { parentIncident: incidentType, onSubmit: PropTypes.func.isRequired };

export default IncidentSplitForm;
