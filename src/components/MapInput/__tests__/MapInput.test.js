import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import MapContext from 'containers/MapContext';
import context from 'containers/MapContext/context';

import { withAppContext } from 'test/utils';
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

fetch.mockResponse(JSON.stringify(geocoderResponse));

describe('components/MapInput', () => {
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

  it('should call handle click', async () => {
    const onChange = jest.fn();
    const { getByTestId, findByTestId } = render(
      withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} onChange={onChange} />)
    );
    const map = getByTestId('map-input');

    expect(setLocationSpy).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(map, { clientX: 100, clientY: 100 });
    });

    await findByTestId('map-input');

    expect(setLocationSpy).toHaveBeenCalledTimes(1);
    expect(setLocationSpy).toHaveBeenCalledWith({
      lat: expect.any(Number),
      lng: expect.any(Number),
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalled();
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
});
