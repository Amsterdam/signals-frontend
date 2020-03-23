import React from 'react';
import { render } from '@testing-library/react';

import MapDetail from './index';

describe('<MapDetail />', () => {
  const props = {
    value: {
      geometrie: { coordinates: [4, 42] },
    },
    mapOptions: {},
  };

  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { getByTestId } = render(<MapDetail {...props} />);

    // Map
    expect(getByTestId('map-test-id')).toBeInTheDocument();
  });

  it.only('should not render correctly', () => {
    props.value = {};
    const { queryByTestId } = render(<MapDetail {...props} />);

    // Map
    expect(queryByTestId('map-test-id')).not.toBeInTheDocument();
  });



});
