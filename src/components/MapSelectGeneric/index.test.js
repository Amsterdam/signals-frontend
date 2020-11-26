import React from 'react';
import { render, screen } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import ZoomMessageControl from '../MapSelect/control/ZoomMessageControl';
import LoadingControl from '../MapSelect/control/LoadingControl';
import ErrorControl from '../MapSelect/control/ErrorControl';

import MapSelectGeneric, { SRS_NAME } from '.';

jest.mock('../MapSelect/control/ZoomMessageControl');
jest.mock('../MapSelect/control/LoadingControl');
jest.mock('../MapSelect/control/ErrorControl');

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

describe('<MapSelectGeneric />', () => {
  const onSelectionChange = jest.fn();
  const urlLatLng =
    'https://geoserver.test/?service=WFS&version=1.1.0&request=GetFeature&srsName={{srsName}}&bbox={{latlng}},{{srsName}}';
  const urlLngLat =
    'https://geoserver.test/?service=WFS&version=1.1.0&request=GetFeature&srsName={{srsName}}&bbox={{lnglat}},{{srsName}}';
  const coordsRegExpString = '(\\d{1,2}\\.\\d{1,16},){4}';
  const urlRegExpString = `^https://geoserver\\.test/\\?service=WFS&version=1\\.1\\.0&request=GetFeature&srsName=${SRS_NAME}&bbox=${coordsRegExpString}${SRS_NAME}$`;

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
        <MapSelectGeneric
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          geojsonUrl={urlLatLng}
          idField="objectnummer"
          hasGPSControl
        />
      )
    );

    await findByTestId('mapSelectGeneric');

    expect(getByTestId('gpsButton')).toBeInTheDocument();
    expect(ZoomMessageControl.mock.instances[0].addTo).toHaveBeenCalled();
    expect(ErrorControl.mock.instances[0].addTo).toHaveBeenCalled();
    expect(LoadingControl.mock.instances[0].addTo).toHaveBeenCalled();
  });

  it('should do bbox fetch', async () => {
    expect(fetch).not.toHaveBeenCalled();

    const { unmount } = render(
      withAppContext(
        <MapSelectGeneric
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          geojsonUrl={urlLatLng}
          idField="objectnummer"
        />
      )
    );

    await screen.findByTestId('mapSelectGeneric');

    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(new RegExp(urlRegExpString)), undefined);

    unmount();
    render(
      withAppContext(
        <MapSelectGeneric
          latlng={latlng}
          onSelectionChange={onSelectionChange}
          geojsonUrl={urlLngLat}
          idField="objectnummer"
        />
      )
    );

    await screen.findByTestId('mapSelectGeneric');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][0]).toMatch(new RegExp(urlRegExpString));
    expect(fetch.mock.calls[0][0]).not.toBe(fetch.mock.calls[1][0]);
  });
});
