import React from 'react';
import { shallow } from 'enzyme';

import amaps from 'amsterdam-amaps/dist/amaps';
import BboxGeojsonLayer from './BboxGeojsonLayer';
import ZoomMessageControl from './ZoomMessageControl';
import LegendControl from './LegendControl';
import LoadingControl from './LoadingControl';
import ErrorControl from './ErrorControl';

import MapSelect from './index';

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

describe('<MapSelect />', () => {
  it('should render correctly', () => {
    const latlng = {
      latitude: 4,
      longitude: 52
    };
    const onSelectionChange = jest.fn();

    const iconMapping = {
      Klok: {
        default:  L.divIcon({className: 'my-div-icon'}),
        selected:  L.divIcon({className: 'my-div-icon-select'}),
      },
    };
    const legend = [
      { key: 'klok', label: 'Klok', iconUrl: 'foo/bar/icon.svg' },
    ];
    const url = 'foo/geo.json?';

    const mockLayer = { addTo: jest.fn() };
    BboxGeojsonLayer.mockReturnValue(mockLayer);

    const zoomControl = { addTo: jest.fn() };
    ZoomMessageControl.mockReturnValue(zoomControl);

    const errorControl = { addTo: jest.fn() };
    ErrorControl.mockReturnValue(errorControl);

    const legendControl = { addTo: jest.fn() };
    LegendControl.mockReturnValue(legendControl);

    const loadingControl = { addTo: jest.fn() };
    LoadingControl.mockReturnValue(loadingControl);

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

    expect(wrapper).toMatchSnapshot();

    expect(LegendControl).toHaveBeenCalledWith({
      position: 'topright',
      zoomMin: 17,
      elements: legend
    });

    expect(mockLayer.addTo).toHaveBeenCalled();
    expect(zoomControl.addTo).toHaveBeenCalled();
    expect(errorControl.addTo).toHaveBeenCalled();
    expect(legendControl.addTo).toHaveBeenCalled();
    expect(loadingControl.addTo).toHaveBeenCalled();
  });
});
