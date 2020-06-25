import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import geographyJSON from 'utils/__tests__/fixtures/geography.json';
import { withMapContext } from 'test/utils';
import OverviewMap from '..';

fetch.mockResponse(JSON.stringify(geographyJSON));

describe('signals/incident-management/containers/IncidentOverviewPage/components/Map', () => {
  it('should render the map and the autosuggest', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('map-base');

    expect(getByTestId('autoSuggest')).toBeInTheDocument();
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
