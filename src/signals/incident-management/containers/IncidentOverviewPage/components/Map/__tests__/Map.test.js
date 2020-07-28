import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import geographyJSON from 'utils/__tests__/fixtures/geography.json';
import { withMapContext } from 'test/utils';
import OverviewMap from '..';

fetch.mockResponse(JSON.stringify(geographyJSON));

describe('signals/incident-management/containers/IncidentOverviewPage/components/Map', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should render the map and the autosuggest', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('map-base');

    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it('should request locations', async () => {
    const { findByTestId, rerender, unmount } = render(withMapContext(<OverviewMap />));

    await findByTestId('map-base');

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

    unmount();

    rerender(withMapContext(<OverviewMap />));

    await findByTestId('map-base');

    expect(fetch.mock.calls).toHaveLength(2);
  });

  it('should render detail panel', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap showPanelOnInit />));

    await findByTestId('map-base');

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
