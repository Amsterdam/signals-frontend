import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import { incidentType } from 'shared/types';

import MapSelect from 'components/MapSelect';
import { getOVLIcon } from '../../../form/MapSelect/iconMapping';

const DEFAULT_COORDS = [4.900312721729279, 52.37248465266875];

const getLatlng = location => {
  const coords = location?.geometrie?.coordinates || DEFAULT_COORDS;
  return {
    latitude: coords[1],
    longitude: coords[0],
  };
};

const Values = styled.div`
  margin-bottom: ${themeSpacing(4)};
`;

const MapSelectPreview = ({ value, endpoint, incident }) => (
  <Fragment>
    <Values>{value.join('; ')}</Values>
    <MapSelect
      geojsonUrl={endpoint}
      getIcon={getOVLIcon}
      iconField="type_name"
      idField="objectnummer"
      latlng={getLatlng(incident.location)}
      selectionOnly
      value={value}
    />
  </Fragment>
);

MapSelectPreview.propTypes = {
  incident: incidentType,
  endpoint: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
};

export default MapSelectPreview;
