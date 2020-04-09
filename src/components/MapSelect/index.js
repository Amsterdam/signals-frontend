import React, { useLayoutEffect, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';
import BboxGeojsonLayer from '@datapunt/leaflet-geojson-bbox-layer';
import 'leaflet/dist/leaflet.css';
import classNames from 'classnames';

import Map from 'components/Map';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import request from 'utils/request';
import MaxSelection from 'utils/maxSelection';

import ZoomMessageControl from './control/ZoomMessageControl';
import LegendControl from './control/LegendControl';
import LoadingControl from './control/LoadingControl';
import ErrorControl from './control/ErrorControl';

import './style.scss';

const SELECTION_MAX_COUNT = 30;

const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
`;

const MapSelect = ({
  geojsonUrl,
  getIcon,
  iconField,
  idField,
  latlng,
  legend,
  onSelectionChange,
  selectionOnly,
  value,
}) => {
  const zoomMin = 13;
  const featuresLayer = useRef();
  const [mapInstance, setMapInstance] = useState();
  const selection = new MaxSelection(SELECTION_MAX_COUNT, value);
  const mapOptions = {
    ...MAP_OPTIONS,
    center: [latlng.latitude, latlng.longitude],
    zoomControl: false,
    minZoom: 10,
    maxZoom: 15,
    zoom: 14,
  };

  const errorControl = useMemo(
    () =>
      new ErrorControl({
        position: 'topleft',
        message: 'Oops, de objecten kunnen niet worden getoond. Probeer het later nog eens.',
      }),
    []
  );

  const fetchRequest = useCallback(
    bbox_str =>
      request(`${geojsonUrl}&bbox=${bbox_str}`).catch(() => {
        errorControl.show();
      }),
    [errorControl, geojsonUrl]
  );

  const bboxGeoJsonLayer = useMemo(
    () =>
      BboxGeojsonLayer(
        {
          fetchRequest,
        },
        {
          zoomMin,

          zoomMax: 15,

          filter: /* istanbul ignore next */ feature => {
            if (selectionOnly) {
              return selection.has(feature.properties[idField]);
            }

            return true;
          },

          pointToLayer: /* istanbul ignore next */ (feature, latlong) =>
            L.marker(latlong, {
              icon: getIcon(feature.properties[iconField], selection.has(feature.properties[idField])),
            }),

          onEachFeature: /* istanbul ignore next */ (feature, layer) => {
            if (onSelectionChange) {
              // Check that the component is in write mode
              layer.on({
                click: e => {
                  const _layer = e.target;
                  const id = _layer.feature.properties[idField];
                  selection.toggle(id);

                  onSelectionChange(selection);
                },
              });
            }
          },
        }
      ),
    [fetchRequest, getIcon, iconField, idField, onSelectionChange, selection, selectionOnly]
  );

  useLayoutEffect(() => {
    featuresLayer.current = bboxGeoJsonLayer;
    // only execute on mount
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!mapInstance) return undefined;

    featuresLayer.current.addTo(mapInstance);

    const zoomMessageControl = new ZoomMessageControl({
      position: 'topleft',
      zoomMin,
    });

    zoomMessageControl.addTo(mapInstance);

    /* istanbul ignore else */
    if (legend) {
      // only show if legend items are provided
      const legendControl = new LegendControl({
        position: 'topright',
        zoomMin,
        elements: legend,
      });

      legendControl.addTo(mapInstance);
    }

    const div = L.DomUtil.create('div', 'loading-control');
    div.innerText = 'Bezig met laden...';

    const loadingControl = new LoadingControl({
      position: 'topleft',
      element: div,
    });

    loadingControl.addTo(mapInstance);

    errorControl.addTo(mapInstance);

    return () => {
      mapInstance.remove();
    };
    // only execute when the mapInstance is available; disabling linter
    // eslint-disable-next-line
  }, [mapInstance]);

  useEffect(/* istanbul ignore next */ () => {
    if (!featuresLayer.current) return;

    selection.set.clear();

    for (const id of value) {
      selection.add(id);
    }

    // Let icons reflect new selection
    featuresLayer.current.getLayers().forEach(layer => {
      const properties = layer.feature.properties;
      const id = properties[idField];
      const iconType = properties[iconField];
      const icon = getIcon(iconType, selection.has(id));

      layer.setIcon(icon);
    });
    // only execute when value changes; disabling linter
    // eslint-disable-next-line
  }, [value]);

  return (
    <StyledMap
      className={classNames('map-component', { write: onSelectionChange })}
      data-testid="mapSelect"
      mapOptions={mapOptions}
      setInstance={setMapInstance}
    />
  );
};

MapSelect.defaultProps = {
  value: [],
  selectionOnly: false,
};

MapSelect.propTypes = {
  latlng: PropTypes.exact({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  geojsonUrl: PropTypes.string.isRequired,
  onSelectionChange: PropTypes.func,
  getIcon: PropTypes.func.isRequired,
  legend: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      iconUrl: PropTypes.string.isRequired,
    })
  ),
  iconField: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  selectionOnly: PropTypes.bool,
};

export default MapSelect;
