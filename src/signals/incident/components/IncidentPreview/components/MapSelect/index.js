import React from 'react';
import PropTypes from 'prop-types';
import configuration from 'shared/services/configuration/configuration';
import get from 'lodash.get';
import MapSelect from '../../../../../../components/MapSelect';
import { getOVLIcon } from '../../../form/MapSelect/iconMapping';
import './style.scss';


const DEFAULT_COORDS = [4.900312721729279, 52.37248465266875];

const getLatlng = (incident) => {
  const coords = get(incident, 'location.geometrie.coordinates', DEFAULT_COORDS);
  return {
    latitude: coords[1],
    longitude: coords[0]
  };
};

const MapSelectPreview = ({ label, value, endpoint, incident }) => {
  const latlng = getLatlng(incident);
  const geojsonUrl = `${configuration.API_ROOT_MAPSERVER}${endpoint}`;

  return (
    <div className="preview-map-select">
      <div className="row">
        <div className="col-5 col-md-4">
          <div>{label}</div>
        </div>
        <div className="col-5 col-md-7">
          <MapSelect
            latlng={latlng}
            geojsonUrl={geojsonUrl}
            getIcon={getOVLIcon}
            iconField="type_name"
            idField="objectnummer"
            value={value}
            selectionOnly
          />
        </div>
      </div>
    </div>
  );
};

MapSelectPreview.propTypes = {
  incident: PropTypes.shape({
    location: PropTypes.object
  }),
  endpoint: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string)
};

export default MapSelectPreview;
