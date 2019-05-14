import React from 'react';
import PropTypes from 'prop-types';
import amaps from 'amsterdam-amaps/dist/amaps';

import './style.scss';
import BboxGeojsonLayer from './BboxGeojsonLayer';
import request from '../../utils/request';
import MaxSelection from '../../utils/maxSelection';
import ZoomMessageControl from './ZoomMessageControl';
import LegendControl from './LegendControl';
import LoadingControl from './LoadingControl';
import ErrorControl from './ErrorControl';

const SELECTION_MAX_COUNT = 30;

const ZOOM_MIN = 17;
const ZOOM_INIT = 18;

export const getIcon = (mapping, typeName, isSelected) => {
  let iconSet = mapping[typeName];
  if (!iconSet) {
    console.error(`icon missing for type, using default. Type is: ${typeName}`); // eslint-disable-line no-console
    iconSet = mapping[Object.keys(mapping)[0]];
  }

  if (isSelected) {
    return iconSet.selected;
  }
  return iconSet.default;
};

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
      iconMapping,
      iconField,
      idField,
      zoomMin,
      value
    } = this.props;

    this.map = amaps.createMap({
      center: {
        latitude: centerLatLng.latitude,
        longitude: centerLatLng.longitude
      },
      layer: 'standaard',
      target: 'mapdiv',
      marker: false,
      search: false,
      zoom: ZOOM_INIT
    });

    const errorControl = new ErrorControl({
      position: 'topleft',
      message: 'Oops, de objecten kunnen niet worden getoond. Probeer het later nog eens.',
    });

    const selection = new MaxSelection(SELECTION_MAX_COUNT, value);
    onSelectionChange(selection);
    this.selection = selection;

    // istanbul ignore next
    const fetchRequest = (bbox_str) => request(`${geojsonUrl}&bbox=${bbox_str}`)
      .catch((e) => {
        console.error('Error loading feature geojson', e); // eslint-disable-line no-console
        errorControl.show();
      });

    this.featuresLayer = BboxGeojsonLayer({
      fetchRequest,
    }, {
      zoomMin,

      pointToLayer(feature, latlng) {
        // istanbul ignore next
        return L.marker(latlng, {
          icon: getIcon(iconMapping, feature.properties[iconField], selection.has(feature.properties[idField]))
        });
      },

      onEachFeature(feature, layer) {
        // istanbul ignore next
        layer.on({
          click: (e) => {
            const _layer = e.target;
            const id = _layer.feature.properties[idField];
            selection.toggle(id);
            onSelectionChange(selection);
          }
        });
      }
    });
    this.featuresLayer.addTo(this.map);

    const zoomMessageControl = new ZoomMessageControl({
      position: 'topleft',
      zoomMin
    });
    zoomMessageControl.addTo(this.map);

    const legendControl = new LegendControl({
      position: 'topright',
      zoomMin,
      elements: this.props.legend
    });
    legendControl.addTo(this.map);

    const div = L.DomUtil.create('div', 'loading-control');
    div.innerText = 'Bezig met laden...';

    const loadingControl = new LoadingControl({
      position: 'topleft',
      element: div
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
        lng
      });
    }

    const value = this.props.value;
    if (value !== prevProps.value) {
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
        const icon = getIcon(this.props.iconMapping, iconType, this.selection.has(id));
        layer.setIcon(icon);
      }
    }
  }

  render() {
    return (
      <div className="map-component">
        <div className="map">
          <div id="mapdiv" />
        </div>
      </div>
    );
  }
}

MapSelect.defaultProps = {
  zoomMin: ZOOM_MIN,
  value: []
};

MapSelect.propTypes = {
  latlng: PropTypes.exact({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }).isRequired,
  geojsonUrl: PropTypes.string.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  iconMapping: PropTypes.objectOf(PropTypes.exact({
    default: PropTypes.instanceOf(L.Icon).isRequired,
    selected: PropTypes.instanceOf(L.Icon).isRequired,
  })).isRequired,
  legend: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    iconUrl: PropTypes.string.isRequired,
  })),
  iconField: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  zoomMin: PropTypes.number,
  value: PropTypes.array,
};

export default MapSelect;
