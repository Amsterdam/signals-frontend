import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import configuration from 'shared/services/configuration/configuration';
import { withMapContext } from 'test/utils';
import geographyJSON from 'utils/__tests__/fixtures/geography.json';

import OverviewMap from '.';

let mockFilterParams;

jest.mock('shared/services/configuration/configuration');
jest.mock('signals/incident-management/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('signals/incident-management/selectors'),
  makeSelectFilterParams: () => mockFilterParams,
}));

fetch.mockResponse(JSON.stringify(geographyJSON));

const createdAfter = '1999-01-01T00:00:00';
const createdBefore = '1999-01-05T00:00:00';

describe('signals/incident-management/containers/IncidentOverviewPage/components/Map', () => {
  beforeEach(() => {
    mockFilterParams = {
      created_after: createdAfter,
      created_before: createdBefore,
    };
  });

  afterEach(() => {
    configuration.__reset();
    fetch.resetMocks();
  });

  it('should render the map and the autosuggest', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it('should request locations', async () => {
    const { findByTestId, rerender, unmount } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    const reDateTime = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    const expectedFilterParams = {
      created_after: reDateTime,
      created_before: reDateTime,
      page_size: /4000/,
    };

    expect(fetch.mock.calls).toHaveLength(1);

    const requestUrl = new URL(fetch.mock.calls[0][0]);
    const params = new URLSearchParams(requestUrl.search);

    Object.keys(expectedFilterParams).forEach(key => {
      expect([...params.keys()].includes(key)).toBeTruthy();

      const [, param] = [...params.entries()].find(([k]) => k === key);
      expect(param).toMatch(expectedFilterParams[key]);
    });

    expect(params.get('created_after')).toEqual(createdAfter);
    expect(params.get('created_before')).toEqual(createdBefore);

    unmount();

    rerender(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    expect(fetch.mock.calls).toHaveLength(2);
  });

  it('should overwrite date filter params with mapFilter24Hours enabled', async () => {
    configuration.featureFlags.mapFilter24Hours = true;
    const { findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    const requestUrl = new URL(fetch.mock.calls[0][0]);
    const params = new URLSearchParams(requestUrl.search);

    expect(params.get('created_after')).not.toEqual(createdAfter);
    expect(params.get('created_before')).not.toEqual(createdBefore);
  });

  it('should render detail panel', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap showPanelOnInit />));

    await findByTestId('overviewMap');

    expect(getByTestId('mapDetailPanel')).toBeInTheDocument();
  });

  it('should close detail panel', async () => {
    const { queryByTestId, findByTestId } = render(withMapContext(<OverviewMap showPanelOnInit />));

    const detailPanel = await findByTestId('mapDetailPanel');

    act(() => {
      fireEvent.click(detailPanel.querySelector('button'));
    });

    expect(queryByTestId('mapDetailPanel')).not.toBeInTheDocument();
  });
});
