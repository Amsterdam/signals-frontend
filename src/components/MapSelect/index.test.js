import React from 'react';
import { shallow } from 'enzyme';

import request from '../../utils/request';
import amaps from 'amsterdam-amaps/dist/amaps';
import BboxGeojsonLayer from './BboxGeojsonLayer';
import ZoomMessageControl from './ZoomMessageControl';
import LegendControl from './LegendControl';
import LoadingControl from './LoadingControl';
import ErrorControl from './ErrorControl';

import MapSelect, {getIcon} from './index';

jest.mock('../../utils/request');
jest.mock('amsterdam-amaps/dist/amaps');
jest.mock('./BboxGeojsonLayer');
jest.mock('./ZoomMessageControl');
jest.mock('./LegendControl');
jest.mock('./LoadingControl');
jest.mock('./ErrorControl');
// jest.mock('./BboxGeojsonLayer', () => ({ // https://remarkablemark.org/blog/2018/06/28/jest-mock-default-named-export/
//   __esModule: true, // this property makes it work
//   default: jest.fn(),
//   namedExport: jest.fn(),
// }));

describe('getIcon', () => {
  const mapping = {
    foo: {
      default: 'bar',
      selected: 'abc',
    }
  };

  it('should get default icon', () => {
    expect(getIcon(mapping, 'foo', false)).toBe('bar');
  });

  it('should get select icon', () => {
    expect(getIcon(mapping, 'foo', true)).toBe('abc');
  });

  it('should default to first icon if missing', () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
    expect(getIcon(mapping, 'missing', false)).toBe('bar');
    expect(global.console.error).toHaveBeenCalledWith('icon missing for type, using default. Type is: missing');
  });
});

describe('<MapSelect />', () => {
  let mockLayer;
  let legend;
  let map = {};

  function createComponent() {
    amaps.createMap.mockReturnValue(map);

    const latlng = {
      latitude: 4,
      longitude: 52
    };
    const onSelectionChange = jest.fn();

    const iconMapping = {
      Klok: {
        default: L.divIcon({className: 'my-div-icon'}),
        selected: L.divIcon({className: 'my-div-icon-select'}),
      },
    };
    legend = [
      {key: 'klok', label: 'Klok', iconUrl: 'foo/bar/icon.svg'},
    ];
    const url = 'foo/geo.json?';

    mockLayer = {addTo: jest.fn()};
    BboxGeojsonLayer.mockReturnValue(mockLayer);

    const wrapper = shallow(
      <MapSelect
        latlng={latlng}
        onSelectionChange={onSelectionChange}
        iconMapping={iconMapping}
        legend={legend}
        geojsonUrl={url}
        iconField="type_name"
        idField="objectnummer"
      />
    );
    return wrapper;
  }

  beforeEach(() => {
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
    BboxGeojsonLayer.mock.calls[0][0].fetchRequest('bbox_str');

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

    expect(wrapper.instance().selection.set).toEqual(new Set(['foo']))
  });
});
