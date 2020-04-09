import React from 'react';
import { render } from '@testing-library/react';
import MapContext from 'containers/MapContext';

import { withAppContext } from 'test/utils';
import * as actions from 'containers/MapContext/actions';
import useFetch from 'hooks/useFetch';
import mockResponse from './mockResponse.json';

import OverviewMap from '..';

jest.mock('hooks/useFetch');
const get = jest.fn();


jest.mock('containers/MapContext/actions', () => ({
  __esModule: true,
  ...jest.requireActual('containers/MapContext/actions'),
  setAddressAction: jest.fn(payload => ({
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
const setAddressSpy = jest.spyOn(actions, 'setAddressAction');

describe('signals/incident-management/containes/IncidentOverviewPage/components/Map', () => {
  afterEach(() => {
    setValuesSpy.mockClear();
    setAddressSpy.mockClear();
  });

  it('should render the map and the autosuggest', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));
    await findByTestId('overviewMap');

    expect(getByTestId('overviewMap')).toBeInTheDocument();
    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it.only('should render the cluster data', async () => {
    useFetch.mockImplementation(() => ({ get, data: mockResponse }));
    const { container, findByTestId, debug } = render(withMapContext(<OverviewMap />));
    await findByTestId('overviewMap');
    debug();

    expect(container.querySelector('.leaflet-marker-icon')).toBeInTheDocument();
    // expect(container.querySelector('.map-marker-incident')).toBeInTheDocument();
  });

  it('should show the detail when marker is selected', () => {});
});
