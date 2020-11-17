import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import ZoomMessageControl from './control/ZoomMessageControl';
import LoadingControl from './control/LoadingControl';
import ErrorControl from './control/ErrorControl';

import MapSelect, { SRS_NAME } from '.';

jest.mock('./control/ZoomMessageControl');
jest.mock('./control/LoadingControl');
jest.mock('./control/ErrorControl');

const fetchResponse = {
  type: 'FeatureCollection',
  name: 'klokken',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
  features: [
    {
      type: 'Feature',
      properties: { ogc_fid: '48634', type_id: '1', type_name: 'Klok', objectnummer: '065121' },
      geometry: { type: 'Point', coordinates: [4.883614, 52.37855] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '93331', type_id: '1', type_name: 'Klok', objectnummer: '017431' },
      geometry: { type: 'Point', coordinates: [4.877793, 52.379065] },
    },
  ],
};

fetch.mockResponse(JSON.stringify(fetchResponse));

describe('<MapSelect />', () => {
  const onSelectionChange = jest.fn();
  const url = 'foo/geo.json?';

  const latlng = {
    latitude: 4,
    longitude: 52,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('should render correctly', async () => {
    const { findByTestId, getByTestId } = render(
      withAppContext(
        <MapSelect
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          geojsonUrl={url}
          idField="objectnummer"
          hasGPSControl
        />
      )
    );

    await findByTestId('mapSelect');

    expect(getByTestId('gpsButton')).toBeInTheDocument();
    expect(ZoomMessageControl.mock.instances[0].addTo).toHaveBeenCalled();
    expect(ErrorControl.mock.instances[0].addTo).toHaveBeenCalled();
    expect(LoadingControl.mock.instances[0].addTo).toHaveBeenCalled();
  });

  it('should do bbox fetch', async () => {
    expect(fetch).not.toHaveBeenCalled();

    const { findByTestId } = render(
      withAppContext(
        <MapSelect latlng={latlng} onSelectionChange={onSelectionChange} geojsonUrl={url} idField="objectnummer" />
      )
    );

    await findByTestId('mapSelect');

    const bboxRegex = new RegExp(`bbox=(\\d{1,2}\\.\\d{1,16},){4}${SRS_NAME}$`);
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(bboxRegex), undefined);
  });
});
