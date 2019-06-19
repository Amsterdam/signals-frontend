import React from 'react';
import PropTypes from 'prop-types';
import configuration from 'shared/services/configuration/configuration';
import get from 'lodash.get';
import MapSelect from '../../../../../../components/MapSelect';
import { getOVLIcon } from '../../../form/MapSelect/iconMapping';
import './style.scss';


const DEFAULT_COORDS = [4.900312721729279, 52.37248465266875];

const getLatlng = (meta) => {
  const coords = get(meta, 'location.geometrie.coordinates', DEFAULT_COORDS);
  return {
    latitude: coords[1],
    longitude: coords[0]
  };
};

const MapSelectPreview = ({ label, value, incident }) => {
  const latlng = getLatlng(incident);
  const geojsonUrl = `${configuration.API_ROOT_MAPSERVER}maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/json;%20subtype=geojson;%20charset=utf-8&Typename=Verlichting&version=1.1.0&srsname=urn:ogc:def:crs:EPSG::4326`;

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
          />
        </div>
      </div>
    </div>
  );
};

MapSelectPreview.propTypes = {
  incident: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string)
};

export default MapSelectPreview;
