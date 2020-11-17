import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@amsterdam/asc-ui';

import MapSelectComponent from 'components/MapSelect';
import configuration from 'shared/services/configuration/configuration';

import Header from '../Header';

export const getLatlng = meta =>
  meta?.incidentContainer?.incident?.location?.geometrie?.coordinates
    ? {
      latitude: meta.incidentContainer.incident.location.geometrie.coordinates[1],
      longitude: meta.incidentContainer.incident.location.geometrie.coordinates[0],
    }
    : {
      latitude: configuration.map.options.center[0],
      longitude: configuration.map.options.center[1],
    };

const Selection = styled.span`
  display: inline-block;
  margin-top: ${themeSpacing(3)};
`;

const MapSelect = ({ handler, touched, hasError = () => {}, meta, parent, getError, validatorsOrOpts }) => {
  const onSelectionChange = selection => {
    const value = [...selection.set.values()];
    parent.meta.updateIncident({ [meta.name]: value });
  };

  const latlng = getLatlng(parent.meta);
  const url = meta.endpoint;

  // Get selection array from "handler".
  // the value is not always an array (it's a string on load).
  // So make sure selection is array:
  const value = handler().value;
  const selection = Array.isArray(value) ? value : [];

  return (
    meta?.isVisible && (
      <Header
        // className value is referenced by form component
        className="mapSelect"
        meta={meta}
        options={validatorsOrOpts}
        touched={touched}
        hasError={hasError}
        getError={getError}
      >
        <MapSelectComponent
          geojsonUrl={url}
          hasGPSControl
          idField={meta.idField}
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          value={selection}
          zoomMin={meta.zoomMin}
        />
        {selection.length > 0 && (
          <Selection>
            Het gaat om{meta.selectionLabel ? ` ${meta.selectionLabel}` : ''}: {selection.join('; ')}
          </Selection>
        )}
      </Header>
    )
  );
};

MapSelect.propTypes = {
  handler: PropTypes.func.isRequired,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.shape({
    className: PropTypes.string,
    endpoint: PropTypes.string.isRequired,
    idField: PropTypes.string.isRequired,
    isVisible: PropTypes.bool,
    name: PropTypes.string,
    selectionLabel: PropTypes.string,
    zoomMin: PropTypes.number,
  }),
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
};

export default MapSelect;
