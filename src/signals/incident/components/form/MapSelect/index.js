import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';

import CONFIGURATION from 'shared/services/configuration/configuration';
import MapSelect from 'components/MapSelect';

import KlokIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Klok-marker.svg';
import KlokSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Klok_select-marker.svg';
import OverspanningIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Overspanning-marker.svg';
import OverspanningSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Overspanning_select-marker.svg';
import GevelArmatuurIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_GevelArmatuur-marker.svg';
import GevelArmatuurSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_GevelArmatuur_select-marker.svg';
import LichtmastIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Lichtmast-marker.svg';
import LichtmastSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Lichtmast_select-marker.svg';
import GrachtmastIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Grachtmast-marker.svg';
import GrachtmastSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Grachtmast_select-marker.svg';
import SchijnwerperIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Schijnwerper-marker.svg';
import OverigSelectIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Overig_select-marker.svg';
import OverigIcon from '!!file-loader!../../../../../shared/images/openbare_verlichting/Icon_32_Overig-marker.svg';

import Header from '../Header/';

const defaultOptions = {
  className: 'object-marker',
  iconSize: [32, 32]
};

const typeIcon = {
  Klok: {
    default: L.icon({ ...defaultOptions, iconUrl: KlokIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: KlokSelectIcon }),
  },
  Overspanning: {
    default: L.icon({ ...defaultOptions, iconUrl: OverspanningIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: OverspanningSelectIcon }),
  },
  Gevel_Armatuur: {
    default: L.icon({ ...defaultOptions, iconUrl: GevelArmatuurIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: GevelArmatuurSelectIcon }),
  },
  Lichtmast: {
    default: L.icon({ ...defaultOptions, iconUrl: LichtmastIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: LichtmastSelectIcon }),
  },
  Grachtmast: {
    default: L.icon({ ...defaultOptions, iconUrl: GrachtmastIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: GrachtmastSelectIcon }),
  },
  Overig_lichtpunt: {
    default: L.icon({ ...defaultOptions, iconUrl: OverigIcon }),
    selected: L.icon({ ...defaultOptions, iconUrl: OverigSelectIcon }),
  },
};

const LEGEND_ITEMS = [
  { key: 'klok', label: 'Klok', iconUrl: KlokIcon },
  { key: 'lichtmast', label: 'Lantaarnpaal', iconUrl: LichtmastIcon },
  { key: 'grachtmast', label: 'Grachtmast', iconUrl: GrachtmastIcon },
  { key: 'overspanning', label: 'Lamp aan kabel', iconUrl: OverspanningIcon },
  { key: 'gevelarmatuur', label: 'Lamp aan gevel', iconUrl: GevelArmatuurIcon },
  { key: 'schijnwerper', label: 'Schijnwerper', iconUrl: SchijnwerperIcon },
  { key: 'overig_lichtpunt', label: 'Overig lichtpunt', iconUrl: OverigIcon },
];

const DEFAULT_COORDS = [
  4.900312721729279,
  52.37248465266875
];

const getLatlng = (meta) => {
  const coords = get(meta, 'incidentContainer.incident.location.geometrie.coordinates', DEFAULT_COORDS);
  return {
    latitude: coords[1],
    longitude: coords[0]
  };
};

const filter_legend = (items, types) => items.filter((element) => types.includes(element.key));

const MapSelectFormComponent = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  const onSelectionChange = (selection) => {
    const value = Array.from(selection.set.values());
    parent.meta.updateIncident({ [meta.name]: value });
  };

  const latlng = getLatlng(parent.meta);
  const apiRoot = CONFIGURATION.API_ROOT_MAPSERVER;
  const url = apiRoot + meta.endpoint;
  const filtered_legend = filter_legend(LEGEND_ITEMS, meta.legend_items);

  // Get selection array from "handler".
  // the value is not always an array (it's a string on load).
  // So make sure selection is array:
  const value = handler().value;
  const selection = Array.isArray(value) ? value : [];
  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible ?
        <div className={`${meta.className || 'col-12'} mode_input`}>
          <Header
            meta={meta}
            options={validatorsOrOpts}
            touched={touched}
            hasError={hasError}
            getError={getError}
          >
            <div className="invoer">
              { latlng && <MapSelect
                latlng={latlng}
                onSelectionChange={onSelectionChange}
                iconMapping={typeIcon}
                legend={filtered_legend}
                geojsonUrl={url}
                iconField="type_name"
                idField="objectnummer"
                zoomMin={meta.zoomMin}
                value={selection}
              /> }
            </div>
          </Header>
        </div>
        : ''}
    </div>
  );
};

MapSelectFormComponent.propTypes = {
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.shape({
    endpoint: PropTypes.string.isRequired,
    zoomMin: PropTypes.number,
    legend_items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  }),
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object
};

export default MapSelectFormComponent;
