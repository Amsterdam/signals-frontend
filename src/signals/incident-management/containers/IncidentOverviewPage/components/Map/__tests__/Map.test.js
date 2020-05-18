import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import geographyJSON from 'utils/__tests__/fixtures/geography.json';
import { incidentIcon, markerIcon } from 'shared/services/configuration/map-markers';
import { withMapContext } from 'test/utils';
import OverviewMap from '..';

fetch.mockResponse(JSON.stringify(geographyJSON));

const markerIconSelector = `.${markerIcon.options.className}`;
const incidentIconSelector = `.${incidentIcon.options.className}`;

describe('signals/incident-management/containers/IncidentOverviewPage/components/Map', () => {
  it('should render the map and the autosuggest', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('map-base');

    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it('should render marker', async () => {
    const { container, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('map-base');

    const markers = container.querySelectorAll(incidentIconSelector);

    expect(container.querySelectorAll(markerIconSelector)).toHaveLength(0);

    act(() => {
      fireEvent.click(markers[0]);
    });

    expect(container.querySelectorAll(markerIconSelector)).toHaveLength(1);
  });

  it('should render detail panel', async () => {
    const { container, queryByTestId, getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('map-base');

    const markers = container.querySelectorAll(incidentIconSelector);
    const firstMarker = markers[0];

    expect(queryByTestId('mapDetailPanel')).not.toBeInTheDocument();
    expect(firstMarker.classList.contains('map-marker-select')).toEqual(false);

    act(() => {
      fireEvent.click(firstMarker);
    });

    expect(firstMarker.classList.contains('map-marker-select')).toEqual(true);

    expect(getByTestId('mapDetailPanel')).toBeInTheDocument();
  });

  it('should close detail panel', async () => {
    const { container, queryByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('map-base');

    const markers = container.querySelectorAll(incidentIconSelector);

    act(() => {
      fireEvent.click(markers[0]);
    });

    const detailPanel = await findByTestId('mapDetailPanel');

    expect(container.querySelectorAll('.map-marker-select')).toHaveLength(1);

    act(() => {
      fireEvent.click(detailPanel.querySelector('button'));
    });

    expect(queryByTestId('mapDetailPanel')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.map-marker-select')).toHaveLength(0);
  });
});
