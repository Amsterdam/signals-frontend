import React from 'react';
import { render } from '@testing-library/react';

import { markerIcon } from 'shared/services/configuration/map-markers';
import MapDetail from './index';

describe('<MapDetail />', () => {
  const props = {
    value: {
      geometrie: { coordinates: [4, 42] },
    },
    zoom: 15,
    icon: markerIcon,
  };

  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { container, getByTestId } = render(<MapDetail {...props} />);

    // Map
    expect(getByTestId('map-detail')).toBeInTheDocument();

    // Marker
    expect(container.querySelector('.sia-map-marker')).toBeInTheDocument();
  });

  it('should not render without value', () => {
    props.value = {};
    const { container, queryByTestId } = render(<MapDetail {...props} />);

    // Map
    expect(queryByTestId('map')).not.toBeInTheDocument();

    // Marker
    expect(container.querySelector('.sia-map-marker')).not.toBeInTheDocument();
  });
});
