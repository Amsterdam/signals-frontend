// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@amsterdam/asc-ui';

import MapSelectGeneric from 'components/MapSelectGeneric';
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

const MapSelectGenericPreview = ({ value, meta, incident }) => (
  <Fragment>
    <Values>{value.join('; ')}</Values>
    <MapSelectGeneric
      geojsonUrl={meta.endpoint}
      idField={meta.idField}
      latlng={getLatlng(incident.location)}
      selectionOnly
      value={value}
    />
  </Fragment>
);

MapSelectGenericPreview.propTypes = {
  incident: incidentType,
  meta: PropTypes.shape({
    endpoint: PropTypes.string.isRequired,
    idField: PropTypes.string.isRequired,
  }),
  value: PropTypes.arrayOf(PropTypes.string),
};

export default MapSelectGenericPreview;
