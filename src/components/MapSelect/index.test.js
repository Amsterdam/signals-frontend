import React from 'react';
import { shallow } from 'enzyme';
import * as BboxGeojsonLayer from '@datapunt/leaflet-geojson-bbox-layer';

import amaps from 'amsterdam-amaps/dist/amaps';

import request from '../../utils/request';
import ZoomMessageControl from './control/ZoomMessageControl';
import LegendControl from './control/LegendControl';
import LoadingControl from './control/LoadingControl';
import ErrorControl from './control/ErrorControl';

import MapSelect from './index';

jest.mock('amsterdam-amaps/dist/amaps');
jest.mock('../../utils/request');
jest.mock('./control/ZoomMessageControl');
jest.mock('./control/LegendControl');
jest.mock('./control/LoadingControl');
jest.mock('./control/ErrorControl');

describe('<MapSelect />', () => {
  let mockLayer;
  let legend;
  const map = {};

  function createComponent() {
    amaps.createMap.mockReturnValue(map);

    const latlng = {
      latitude: 4,
      longitude: 52
    };
    const onSelectionChange = jest.fn();

    const getIcon = (type, isSelected) => {
      if (isSelected) {
        return L.divIcon({ className: 'my-div-icon-select' });
      }
      return L.divIcon({ className: 'my-div-icon' });
    };

    legend = [
      { key: 'klok', label: 'Klok', iconUrl: 'foo/bar/icon.svg' },
    ];
    const url = 'foo/geo.json?';

    mockLayer = { addTo: jest.fn() };
    BboxGeojsonLayer.default.mockReturnValue(mockLayer);

    const wrapper = shallow(
      <MapSelect
        latlng={latlng}
        onSelectionChange={onSelectionChange}
        getIcon={getIcon}
        legend={legend}
        geojsonUrl={url}
        iconField="type_name"
        idField="objectnummer"
      />
    );
    return wrapper;
  }

  beforeEach(() => {
    BboxGeojsonLayer.default = jest.fn();
    ZoomMessageControl.mockClear();
    ErrorControl.mockClear();
    LegendControl.mockClear();
    LoadingControl.mockClear();
  });

  it('should render correctly', () => {
    const wrapper = createComponent();

    expect(wrapper).toMatchSnapshot();

    expect(LegendControl).toHaveBeenCalledWith({
      position: 'topright',
      zoomMin: 17,
      elements: legend
    });

    expect(mockLayer.addTo).toHaveBeenCalled();
    expect(amaps.createMap).toHaveBeenCalled();
    expect(ZoomMessageControl.mock.instances[0].addTo).toHaveBeenCalled();
    expect(ErrorControl.mock.instances[0].addTo).toHaveBeenCalled();
    expect(LegendControl.mock.instances[0].addTo).toHaveBeenCalled();
    expect(LoadingControl.mock.instances[0].addTo).toHaveBeenCalled();
  });

  it('should do bbox fetch', () => {
    createComponent();

    request.mockReturnValue(Promise.resolve());
    BboxGeojsonLayer.default.mock.calls[0][0].fetchRequest('bbox_str');

    expect(request).toHaveBeenCalledWith('foo/geo.json?&bbox=bbox_str');
  });

  it('should pan to new center', () => {
    const wrapper = createComponent();
    const lat = 42;
    const lng = 777;
    map.panTo = jest.fn();

    wrapper.setProps({
      latlng: {
        latitude: lat,
        longitude: lng
      }
    });

    expect(map.panTo).toHaveBeenCalledWith({
      lat,
      lng
    });
  });

  it('should change the icons based on the selection', () => {
    const wrapper = createComponent();

    mockLayer.getLayers = jest.fn(() => []);
    wrapper.setProps({
      value: ['foo']
    });

    expect(wrapper.instance().selection.set).toEqual(new Set(['foo']));
  });
});
