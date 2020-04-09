import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import MapContext from 'containers/MapContext';
import { withAppContext } from 'test/utils';
import geographyJSON from 'utils/__tests__/fixtures/geography.json';
import { incidentIcon, markerIcon } from 'shared/services/configuration/map-markers';
import OverviewMap from '..';

fetch.mockResponse(JSON.stringify(geographyJSON));

const withMapContext = Component => withAppContext(<MapContext>{Component}</MapContext>);
const markerIconSelector = `.${markerIcon.options.className}`;
const incidentIconSelector = `.${incidentIcon.options.className}`;

describe('signals/incident-management/containers/IncidentOverviewPage/components/Map', () => {
  it('should render the map and the autosuggest', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it('should render marker', async () => {
    const { container, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    const markers = container.querySelectorAll(incidentIconSelector);

    expect(container.querySelectorAll(markerIconSelector)).toHaveLength(0);

    act(() => {
      fireEvent.click(markers[0]);
    });

    expect(container.querySelectorAll(markerIconSelector)).toHaveLength(1);
  });

  it('should render detail panel', async () => {
    const { container, queryByTestId, getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    const markers = container.querySelectorAll(incidentIconSelector);

    expect(queryByTestId('mapDetailPanel')).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(markers[0]);
    });

    expect(getByTestId('mapDetailPanel')).toBeInTheDocument();
  });
});
