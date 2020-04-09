import React from 'react';
import PropTypes from 'prop-types';
import amaps from '@datapunt/amsterdam-amaps/dist/amaps';

import 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css';
import '@datapunt/amsterdam-amaps/dist/nlmaps/dist/assets/css/nlmaps.css';
import BboxGeojsonLayer from '@datapunt/leaflet-geojson-bbox-layer';
import classNames from 'classnames';
import isEqual from 'lodash.isequal';

import './style.scss';
import request from '../../utils/request';
import MaxSelection from '../../utils/maxSelection';
import ZoomMessageControl from './control/ZoomMessageControl';
import LegendControl from './control/LegendControl';
import LoadingControl from './control/LoadingControl';
import ErrorControl from './control/ErrorControl';

const SELECTION_MAX_COUNT = 30;

const ZOOM_MIN = 17;
const ZOOM_INIT = 18;

class MapSelect extends React.Component {
  /**
   * Multiple features select map
   * Required geojson endpoint supporting bbox parameter
   */
  componentDidMount() {
    const {
      latlng: centerLatLng,
      geojsonUrl,
      onSelectionChange,
      getIcon,
      iconField,
      idField,
      zoomMin,
      value,
      selectionOnly,
    } = this.props;

    this.map = amaps.createMap({
      center: {
        latitude: centerLatLng.latitude,
        longitude: centerLatLng.longitude,
      },
      layer: 'standaard',
      target: 'mapSelect', // requires unique id because amaps doesn't support passing dom element (according to docs)
      marker: false,
      search: false,
      zoom: ZOOM_INIT,
    });

    const errorControl = new ErrorControl({
      position: 'topleft',
      message: 'Oops, de objecten kunnen niet worden getoond. Probeer het later nog eens.',
    });

    const selection = new MaxSelection(SELECTION_MAX_COUNT, value);
    this.selection = selection;

    // istanbul ignore next
    const fetchRequest = bbox_str => request(`${geojsonUrl}&bbox=${bbox_str}`)
      .catch(e => {
        console.error('Error loading feature geojson', e); // eslint-disable-line no-console
        errorControl.show();
      });

    this.featuresLayer = BboxGeojsonLayer({
      fetchRequest,
    }, {
      zoomMin,

      filter(feature) {
        if (selectionOnly) {
          return selection.has(feature.properties[idField]);
        }
        return true;
      },

      pointToLayer(feature, latlng) {
        // istanbul ignore next
        return L.marker(latlng, {
          icon: getIcon(feature.properties[iconField], selection.has(feature.properties[idField])),
        });
      },

      onEachFeature(feature, layer) {
        if (onSelectionChange) {
          // Check that the component is in write mode
          // istanbul ignore next
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
    });
    this.featuresLayer.addTo(this.map);

    const zoomMessageControl = new ZoomMessageControl({
      position: 'topleft',
      zoomMin,
    });
    zoomMessageControl.addTo(this.map);

    if (this.props.legend) {
      // only show if legend items are provided
      const legendControl = new LegendControl({
        position: 'topright',
        zoomMin,
        elements: this.props.legend,
      });
      legendControl.addTo(this.map);
    }


    const div = L.DomUtil.create('div', 'loading-control');
    div.innerText = 'Bezig met laden...';

    const loadingControl = new LoadingControl({
      position: 'topleft',
      element: div,
    });
    loadingControl.addTo(this.map);

    errorControl.addTo(this.map);
  }

  componentDidUpdate(prevProps) {
    const lat = this.props.latlng.latitude;
    const lng = this.props.latlng.longitude;
    if (lat !== prevProps.latlng.latitude || lng !== prevProps.latlng.longitude) {
      this.map.panTo({
        lat,
        lng,
      });
    }

    const value = this.props.value;
    if (isEqual(value, prevProps.value) === false) {
      // Selection changed, update internal selection
      this.selection.set.clear();
      for (const id of value) {
        this.selection.add(id);
      }

      // Let icons reflect new selection
      // istanbul ignore next
      for (const layer of this.featuresLayer.getLayers()) {
        const properties = layer.feature.properties;
        const id = properties[this.props.idField];
        const iconType = properties[this.props.iconField];
        const icon = this.props.getIcon(iconType, this.selection.has(id));
        layer.setIcon(icon);
      }
    }
  }

  render() {
    return (
      <div className={classNames('map-component', { write: this.props.onSelectionChange })}>
        <div className="map">
          <div className="map-container" id="mapSelect" />
        </div>
      </div>
    );
  }
}

MapSelect.defaultProps = {
  zoomMin: ZOOM_MIN,
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
  legend: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    iconUrl: PropTypes.string.isRequired,
  })),
  iconField: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  zoomMin: PropTypes.number,
  value: PropTypes.array,
  selectionOnly: PropTypes.bool,
};

export default MapSelect;
