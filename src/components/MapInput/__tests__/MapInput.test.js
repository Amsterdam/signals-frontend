import React from 'react';
import { render, fireEvent, act, wait } from '@testing-library/react';

import MapContext from 'containers/MapContext';
import context from 'containers/MapContext/context';
import { INPUT_DELAY } from 'components/AutoSuggest';
import { withAppContext, resolveAfterMs } from 'test/utils';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { markerIcon } from 'shared/services/configuration/map-markers';
import * as actions from 'containers/MapContext/actions';

import MapInput from '..';

jest.mock('containers/MapContext/actions', () => ({
  __esModule: true,
  ...jest.requireActual('containers/MapContext/actions'),
  setLocationAction: jest.fn(payload => ({
    type: 'type',
    payload,
  })),
  setValuesAction: jest.fn(payload => ({
    type: 'type',
    payload,
  })),
}));

const withMapContext = Component => withAppContext(<MapContext>{Component}</MapContext>);

const setValuesSpy = jest.spyOn(actions, 'setValuesAction');
const setLocationSpy = jest.spyOn(actions, 'setLocationAction');
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
    geometrie: {
      type: 'Point',
      coordinates: [4, 52],
    },
  };

  it('should render the map and the autosuggest', () => {
    const { getByTestId } = render(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} />));

    expect(getByTestId('map-input')).toBeInTheDocument();
    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it('should dispatch setValuesAction', () => {
    const { rerender } = render(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={{}} />));

    expect(setValuesSpy).not.toHaveBeenCalled();

    const value = { addressText: 'Foo' };

    rerender(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={value} />));

    expect(setValuesSpy).toHaveBeenCalledTimes(1);
    expect(setValuesSpy).toHaveBeenCalledWith(value);

    rerender(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} />));

    expect(setValuesSpy).toHaveBeenCalledTimes(2);
    expect(setValuesSpy).toHaveBeenCalledWith(testLocation);
  });

  it('should handle click', async () => {
    fetch.mockResponseOnce(JSON.stringify(geocoderResponse)).mockResponseOnce(JSON.stringify(bagResponse));

    const onChange = jest.fn();
    const { getByTestId, findByTestId } = render(
      withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} onChange={onChange} />)
    );
    const map = getByTestId('map-input');

    expect(setLocationSpy).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(setValuesSpy).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(map, { clientX: 100, clientY: 100 });
    });

    await findByTestId('map-input');

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
    const map = getByTestId('map-input');

    expect(setValuesSpy).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(map, { clientX: 100, clientY: 100 });
    });

    await findByTestId('map-input');

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

  it('should render marker', async () => {
    const location = {
      lat: 52.36058599633851,
      lng: 4.894292258032637,
    };

    const { container, findByTestId, rerender } = render(
      withAppContext(
        <context.Provider value={{ state: {}, dispatch: () => {} }}>
          <MapInput mapOptions={MAP_OPTIONS} value={testLocation} />
        </context.Provider>
      )
    );

    await findByTestId('map-input');

    expect(container.querySelector(`.${markerIcon.options.className}`)).not.toBeInTheDocument();

    rerender(
      withAppContext(
        <context.Provider value={{ state: { location }, dispatch: () => {} }}>
          <MapInput mapOptions={MAP_OPTIONS} value={testLocation} />
        </context.Provider>
      )
    );

    await findByTestId('map-input');

    expect(container.querySelector(`.${markerIcon.options.className}`)).toBeInTheDocument();
  });

  it.only('should clear location and not render marker', async () => {
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

    expect(setLocationSpy).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: addressText } });
    });

    await wait(() => resolveAfterMs(INPUT_DELAY));

    expect(setLocationSpy).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: '' } });
    });

    await wait(() => resolveAfterMs(INPUT_DELAY));

    expect(setLocationSpy).toHaveBeenCalledWith();
  });
});
