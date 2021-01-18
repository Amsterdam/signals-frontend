import type { ReactNode } from 'react';
import React, { useContext } from 'react';

import { render, screen } from '@testing-library/react';
import type { FetchMock } from 'jest-fetch-mock';
import type { FeatureCollection } from 'geojson';

import { Map } from '@amsterdam/react-maps';
import type { MapOptions } from 'leaflet';
import containersJson from 'utils/__tests__/fixtures/containers.json';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import WfsLayer, { isLayerVisible } from './WfsLayer';
import type { WfsLayerProps } from '../types';
import WfsDataContext from './context';

const fetchMock = fetch as FetchMock;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const options: MapOptions = {
  ...MAP_OPTIONS,
  center: [52.37309068742423, 4.879893985747362],
  zoom: 14,
};

const withMapContainer = (Component: ReactNode) => <Map data-testid="map-test" options={options}>{Component}</Map>;

describe('isLayerVisible', () => {
  it('should return the layer visibility', () => {
    expect(isLayerVisible(11, { max: 10, min: 12 })).toBe(true);
    expect(isLayerVisible(9, { max: 10, min: 12 })).toBe(false);
    expect(isLayerVisible(9, { min: 12 })).toBe(true);
    expect(isLayerVisible(13, { min: 12 })).toBe(false);
    expect(isLayerVisible(13, { max: 10, min: 12 })).toBe(false);
    expect(isLayerVisible(13, { max: 10 })).toBe(true);
    expect(isLayerVisible(9, { max: 10 })).toBe(false);
  });
});

describe('src/signals/incident/components/form/ContainerSelect/WfsLayer', () => {
  const mockedGetBBox = jest.fn();
  let wfsLayerProps: WfsLayerProps;

  beforeEach(() => {
    fetchMock.resetMocks();
    wfsLayerProps = {
      url: 'https://wfs-url',
      options: {
        getBBox: mockedGetBBox,
      },
      zoomLevel: { max: 10 },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not render when outside zoom level does not allow it', () => {
    fetchMock.mockResponseOnce(JSON.stringify(containersJson), { status: 200 });
    render(
      withMapContainer(<WfsLayer {...wfsLayerProps} zoomLevel={{ max: 15 }} ><span></span></WfsLayer>)
    );

    expect(screen.getByTestId('map-test')).toBeInTheDocument();
    expect(mockedGetBBox).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });


  it('should render the wfs layer in the map', async() => {
    fetchMock.mockResponseOnce(JSON.stringify(containersJson), { status: 200 });
    const setContextData = jest.fn();

    const TestLayer = () => {
      const data = useContext<FeatureCollection>(WfsDataContext);
      setContextData(data);

      return <span data-testid="test-layer"></span>;
    };
    render(
      withMapContainer(<WfsLayer {...wfsLayerProps} ><TestLayer /></WfsLayer>)
    );

    await screen.findByTestId('map-test');
    expect(mockedGetBBox).toHaveBeenCalledTimes(1);
    expect(setContextData).toHaveBeenCalledWith(containersJson);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should not render when an AbortError occurs in the wfs call', () => {
    const error = new Error();
    error.name = 'AbortError';
    fetchMock.mockRejectOnce(error);
    render(
      withMapContainer(<WfsLayer {...wfsLayerProps} ><span></span></WfsLayer>)
    );

    expect(mockedGetBBox).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should conlole.error when other error occurs in the wfs call', async() => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const error = new Error();
    error.name = 'OtherError';
    fetchMock.mockRejectOnce(error);
    render(
      withMapContainer(<WfsLayer {...wfsLayerProps} ><span></span></WfsLayer>)
    );

    await screen.findByTestId('map-test');
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockClear();
    expect(mockedGetBBox).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
