import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import MapContext from 'containers/MapContext';
import { withAppContext } from 'test/utils';
import geographyJSON from 'utils/__tests__/fixtures/geography.json';
import OverviewMap from '..';

fetch.mockResponse(JSON.stringify(geographyJSON));

const withMapContext = Component => withAppContext(<MapContext>{Component}</MapContext>);

describe('signals/incident-management/containers/IncidentOverviewPage/components/Map', () => {
  it('should render the map and the autosuggest', async () => {
    const { getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it('should render marker', async () => {
    const { container, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    // expect(container.firstChild).toMatchSnapshot();

    const markers = container.querySelectorAll('.map-marker-incident');

    expect(container.querySelectorAll('.map-marker-select')).toHaveLength(0);

    act(() => {
      fireEvent.click(markers[0]);
    });

    expect(container.querySelectorAll('.map-marker-select')).toHaveLength(1);
  });

  it.only('should render detail panel', async () => {
    const { container, queryByTestId, getByTestId, findByTestId } = render(withMapContext(<OverviewMap />));

    await findByTestId('overviewMap');

    const markers = container.querySelectorAll('.map-marker-incident');

    expect(queryByTestId('mapDetailPanel')).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(markers[0]);
    });

    expect(getByTestId('mapDetailPanel')).toBeInTheDocument();
  });
});
