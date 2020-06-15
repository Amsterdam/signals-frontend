import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import MapSelectComponent from 'components/MapSelect';

import Header from '../Header';
import { getOVLIcon, LEGEND_ITEMS } from './iconMapping';

const filter_legend = (items, types) => items.filter(element => types.includes(element.key));

const DEFAULT_COORDS = [4.900312721729279, 52.37248465266875];

const getLatlng = meta => {
  const coords = get(meta, 'incidentContainer.incident.location.geometrie.coordinates', DEFAULT_COORDS);
  return {
    latitude: coords[1],
    longitude: coords[0],
  };
};

const Selection = styled.span`
  display: inline-block;
  margin-top: ${themeSpacing(3)};
`;

const MapSelect = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  const onSelectionChange = selection => {
    const value = Array.from(selection.set.values());
    parent.meta.updateIncident({ [meta.name]: value });
  };

  const latlng = getLatlng(parent.meta);
  const url = meta.endpoint;
  const filtered_legend = filter_legend(LEGEND_ITEMS, meta.legend_items);

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
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          getIcon={getOVLIcon}
          legend={filtered_legend}
          geojsonUrl={url}
          iconField="type_name"
          idField="objectnummer"
          zoomMin={meta.zoomMin}
          value={selection}
        />
        {selection.length > 0 && <Selection>Het gaat om lamp of lantaarnpaal met nummer: {selection.join('; ')}</Selection>}
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
    isVisible: PropTypes.bool,
    legend_items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    name: PropTypes.string,
    zoomMin: PropTypes.number,
  }),
  parent: PropTypes.object,
  getError: PropTypes.func,
  validatorsOrOpts: PropTypes.object,
};

export default MapSelect;
