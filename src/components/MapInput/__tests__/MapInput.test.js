import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';

import context from 'containers/MapContext/context';

import geoSearchJSON from 'utils/__tests__/fixtures/geosearch.json';
import { INPUT_DELAY } from 'components/AutoSuggest';
import { withAppContext, resolveAfterMs, withMapContext } from 'test/utils';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { markerIcon } from 'shared/services/configuration/map-markers';
import * as actions from 'containers/MapContext/actions';
import { DOUBLE_CLICK_TIMEOUT } from 'hooks/useDelayedDoubleClick';
import configuration from 'shared/services/configuration/configuration';

import { findFeatureByType } from '../services/reverseGeocoderService';
import MapInput from '..';

jest.mock('containers/MapContext/actions', () => ({
  __esModule: true,
  ...jest.requireActual('containers/MapContext/actions'),
  resetLocationAction: jest.fn(() => ({
    type: 'type',
  })),
  setLocationAction: jest.fn(payload => ({
    type: 'type',
    payload,
  })),
  setValuesAction: jest.fn(payload => ({
    type: 'type',
    payload,
  })),
}));

jest.mock('shared/services/configuration/configuration');

const setValuesSpy = jest.spyOn(actions, 'setValuesAction');
const setLocationSpy = jest.spyOn(actions, 'setLocationAction');
const resetLocationSpy = jest.spyOn(actions, 'resetLocationAction');
const geocoderResponse = {
  response: {
    numFound: 1,
    start: 0,
    maxScore: 15.822564,
    docs: [
      {
        woonplaatsnaam: 'Amsterdam',
        huis_nlt: '117',
        weergavenaam: 'Rozengracht 117, 1016LV Amsterdam',
        straatnaam_verkort: 'Rozengr',
        id: 'adr-b8200d39f3562a4ecac2f8371187df61',
        postcode: '1016LV',
        centroide_ll: 'POINT(4.87900903 52.37280796)',
      },
    ],
  },
};

const bagResponse = {
  features: [
    {
      properties: {
        code: 'N',
        display: 'Noord',
        distance: 4467.47982312323,
        id: '03630000000019',
        type: 'gebieden/stadsdeel',
        uri: 'https://api.data.amsterdam.nl/gebieden/stadsdeel/03630000000019/',
      },
    },
    {
      properties: {
        code: '61b',
        display: 'Vogelbuurt Zuid',
        distance: 109.145476159977,
        id: '03630000000644',
        type: 'gebieden/buurt',
        uri: 'https://api.data.amsterdam.nl/gebieden/buurt/03630000000644/',
        vollcode: 'N61b',
      },
    },
  ],
  type: 'FeatureCollection',
};

describe('components/MapInput', () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(geocoderResponse));
  });

  afterEach(() => {
    setValuesSpy.mockClear();
    setLocationSpy.mockClear();
  });

  const testLocation = {
    location: {
      lat: 52.36279769502027,
      lng: 4.796855450052992,
    },
  };

  it('should render the map and the autosuggest', () => {
    const { getByTestId } = render(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} />));

    expect(getByTestId('map-base')).toBeInTheDocument();
    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it('should dispatch setValuesAction', () => {
    const { rerender } = render(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={{}} />));

    expect(setValuesSpy).not.toHaveBeenCalled();

    const value = { addressText: 'Foo', ...testLocation };

    rerender(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={value} />));

    expect(setValuesSpy).toHaveBeenCalledTimes(1);
    expect(setValuesSpy).toHaveBeenCalledWith(value);

    rerender(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} />));

    expect(setValuesSpy).toHaveBeenCalledTimes(2);
    expect(setValuesSpy).toHaveBeenCalledWith(testLocation);

    setValuesSpy.mockClear();
    setLocationSpy.mockClear();

    rerender(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} />));

    expect(setValuesSpy).not.toHaveBeenCalled();
  });

  it('should handle click', async () => {
    fetch.mockResponseOnce(JSON.stringify(geocoderResponse)).mockResponseOnce(JSON.stringify(bagResponse));

    const onChange = jest.fn();
    const { findByTestId } = render(
      withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} onChange={onChange} />)
    );

    const map = await findByTestId('map-base');

    expect(setLocationSpy).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(setValuesSpy).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(map, { clientX: 100, clientY: 100 });
    });

    await findByTestId('map-base');

    expect(setLocationSpy).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(setValuesSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => resolveAfterMs(DOUBLE_CLICK_TIMEOUT));

    expect(setLocationSpy).toHaveBeenCalledTimes(1);
    expect(setLocationSpy).toHaveBeenCalledWith({
      lat: expect.any(Number),
      lng: expect.any(Number),
    });

    expect(setValuesSpy).toHaveBeenCalledTimes(2);
    expect(setValuesSpy).toHaveBeenLastCalledWith({
      addressText: expect.stringMatching(/.+/),
      address: expect.any(Object),
      stadsdeel: bagResponse.features[0].properties.code,
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      geometrie: expect.any(Object),
      address: expect.any(Object),
      stadsdeel: bagResponse.features[0].properties.code,
    });
  });

  it('should handle click when a location has no address', async () => {
    const onChange = jest.fn();
    const noneFoundResponse = {
      response: {
        numFound: 0,
        start: 0,
        maxScore: 0.0,
        docs: [],
      },
    };
    fetch.mockResponseOnce(JSON.stringify(noneFoundResponse)).mockResponseOnce(JSON.stringify(bagResponse));

    const { getByTestId, findByTestId } = render(
      withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} onChange={onChange} />)
    );
    const map = getByTestId('map-base');

    expect(setValuesSpy).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(map, { clientX: 100, clientY: 100 });
    });

    await findByTestId('map-base');

    expect(setValuesSpy).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();

    await waitFor(() => resolveAfterMs(DOUBLE_CLICK_TIMEOUT));

    expect(setValuesSpy).toHaveBeenCalledTimes(2);
    expect(setValuesSpy).toHaveBeenLastCalledWith({
      addressText: '',
      address: '',
      stadsdeel: bagResponse.features[0].properties.code,
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      geometrie: expect.any(Object),
      stadsdeel: bagResponse.features[0].properties.code,
    });
  });

  it('should take stadsdeel value from configuration with click on map', async () => {
    const stadsdeel = 'W';
    configuration.map.options.stadsdeel = stadsdeel;

    fetch.mockResponseOnce(JSON.stringify(geocoderResponse));

    const onChange = jest.fn();
    const { findByTestId } = render(
      withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} onChange={onChange} />)
    );

    const map = await findByTestId('map-base');

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(map, { clientX: 100, clientY: 100 });
    });

    await waitFor(() => resolveAfterMs(DOUBLE_CLICK_TIMEOUT));

    expect(setValuesSpy).toHaveBeenCalledTimes(2);
    expect(setValuesSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        stadsdeel,
      })
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        stadsdeel,
      })
    );

    delete configuration.map.options.stadsdeel;
  });

  it('should render marker and center the map', async () => {
    const location = {
      lat: 52.36058599633851,
      lng: 4.894292258032637,
    };

    const mapMoveSpy = jest.fn();

    const { container, findByTestId, rerender } = render(
      withAppContext(
        <context.Provider value={{ state: {}, dispatch: () => {} }}>
          <MapInput
            mapOptions={MAP_OPTIONS}
            value={testLocation}
            events={{
              movestart: mapMoveSpy,
            }}
          />
        </context.Provider>
      )
    );

    await findByTestId('map-base');

    expect(container.querySelector(`.${markerIcon.options.className}`)).not.toBeInTheDocument();
    expect(mapMoveSpy).not.toHaveBeenCalled();

    rerender(
      withAppContext(
        <context.Provider value={{ state: { location }, dispatch: () => {} }}>
          <MapInput
            mapOptions={MAP_OPTIONS}
            value={testLocation}
            events={{
              movestart: mapMoveSpy,
            }}
          />
        </context.Provider>
      )
    );

    await findByTestId('map-base');

    expect(container.querySelector(`.${markerIcon.options.className}`)).toBeInTheDocument();
    expect(mapMoveSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle onSelect', async () => {
    const onChange = jest.fn();
    const { getByTestId, findByTestId } = render(
      withAppContext(
        <context.Provider
          value={{
            state: {
              lat: 51,
              lng: 4,
            },
            dispatch: () => {},
          }}
        >
          <MapInput mapOptions={MAP_OPTIONS} value={testLocation} onChange={onChange} />
        </context.Provider>
      )
    );

    // provide input with value
    const input = getByTestId('autoSuggest').querySelector('input');
    const value = 'Midden';

    act(() => {
      input.focus();
    });

    act(() => {
      fireEvent.change(input, { target: { value } });
    });

    const suggestList = await findByTestId('suggestList');
    const firstElement = suggestList.querySelector('li:nth-of-type(1)');

    expect(setValuesSpy).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();

    // mock the geosearch response
    fetch.mockResponse(JSON.stringify(geoSearchJSON));

    // click option in list
    act(() => {
      fireEvent.click(firstElement);
    });

    await findByTestId('map-base');

    expect(setValuesSpy).toHaveBeenCalledTimes(2);
    expect(setValuesSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        location: expect.any(Object),
        address: expect.any(Object),
        addressText: input.value,
      })
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        geometrie: expect.any(Object),
        address: expect.any(Object),
        stadsdeel: findFeatureByType(geoSearchJSON.features, 'gebieden/stadsdeel').code,
      })
    );
  });

  it('should handle onSelect with stadsdeel from configuration', async () => {
    const stadsdeel = '@foo@';
    configuration.map.options.stadsdeel = stadsdeel;

    const onChange = jest.fn();
    const { getByTestId, findByTestId } = render(
      withAppContext(
        <context.Provider
          value={{
            state: {
              lat: 51,
              lng: 4,
            },
            dispatch: () => {},
          }}
        >
          <MapInput mapOptions={MAP_OPTIONS} value={testLocation} onChange={onChange} />
        </context.Provider>
      )
    );

    // provide input with value
    const input = getByTestId('autoSuggest').querySelector('input');
    const value = 'Midden';

    act(() => {
      input.focus();
    });

    act(() => {
      fireEvent.change(input, { target: { value } });
    });

    const suggestList = await findByTestId('suggestList');
    const firstElement = suggestList.querySelector('li:nth-of-type(1)');

    expect(onChange).not.toHaveBeenCalled();

    // mock the geosearch response
    fetch.mockResponse(JSON.stringify(geoSearchJSON));

    // click option in list
    act(() => {
      fireEvent.click(firstElement);
    });

    await findByTestId('map-base');

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        stadsdeel,
      })
    );

    delete configuration.map.options.stadsdeel;
  });

  it('should clear location and not render marker', async () => {
    const location = {
      lat: 52.36058599633851,
      lng: 4.894292258032637,
    };
    const addressText = 'Foo bar street 10';

    const { findByTestId } = render(
      withAppContext(
        <context.Provider value={{ state: { location, addressText }, dispatch: () => {} }}>
          <MapInput mapOptions={MAP_OPTIONS} value={testLocation} />
        </context.Provider>
      )
    );
    const autoSuggest = await findByTestId('autoSuggest');
    const input = autoSuggest.querySelector('input');

    expect(resetLocationSpy).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: addressText } });
    });

    await waitFor(() => resolveAfterMs(INPUT_DELAY));

    expect(resetLocationSpy).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: '' } });
    });

    await waitFor(() => resolveAfterMs(INPUT_DELAY));

    expect(resetLocationSpy).toHaveBeenCalledWith();
  });
});
