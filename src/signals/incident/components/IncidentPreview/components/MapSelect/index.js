import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@amsterdam/asc-ui';

import MapSelect from 'components/MapSelect';
import configuration from 'shared/services/configuration/configuration';
import { incidentType } from 'shared/types';

export const getLatlng = location =>
  location?.geometrie?.coordinates
    ? {
      latitude: location.geometrie.coordinates[1],
      longitude: location.geometrie.coordinates[0],
    }
    : {
      latitude: configuration.map.options.center[0],
      longitude: configuration.map.options.center[1],
    };

const Values = styled.div`
  margin-bottom: ${themeSpacing(4)};
`;

const MapSelectPreview = ({ value, meta, incident }) => (
  <Fragment>
    <Values>{value.join('; ')}</Values>
    <MapSelect
      geojsonUrl={meta.endpoint}
      idField={meta.idField}
      latlng={getLatlng(incident.location)}
      selectionOnly
      value={value}
    />
  </Fragment>
);

MapSelectPreview.propTypes = {
  incident: incidentType,
  meta: {
    endpoint: PropTypes.string.isRequired,
    idField: PropTypes.string.isRequired,
  },
  value: PropTypes.arrayOf(PropTypes.string),
};

export default MapSelectPreview;
