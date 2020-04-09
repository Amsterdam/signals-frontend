import React from 'react';
import { render } from '@testing-library/react';

import { Map } from '@datapunt/react-maps';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import MarkerCluster from '..';

const options = {
  ...MAP_OPTIONS,
  maxZoom: 18,
};
const withMapContainer = Component => (<Map data-testid='map-test' options={options}>{Component}</Map>);

describe('signals/incident-management/containes/IncidentOverviewPage/components/MarkerCluster', () => {
  it('should render the cluster layer in the map', () => {
    const setInstanceMock = jest.fn();
    const { getByTestId } = render(
      withMapContainer(<MarkerCluster options={{ test: 1 }} setInstance={setInstanceMock} />)
    );

    expect(getByTestId('map-test')).toBeInTheDocument();
    expect(setInstanceMock).toHaveBeenCalledTimes(1);
  });
});
