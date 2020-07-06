import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import configuration from 'shared/services/configuration/configuration';

import Footer from './index';

describe('<Footer />', () => {
  it('should render correctly', () => {
    configuration.links.privacy = 'https://www.amsterdam.nl/privacy/';
    const { container, getByTestId } = render(
      withAppContext(<Footer />)
    );

    expect(container.querySelector(
      'div.no-print')
    ).toBeInTheDocument();
    expect(getByTestId('disclaimer')).toBeInTheDocument();
    expect(container.querySelector(
      'a[href="https://www.amsterdam.nl/privacy/"]')
    ).toBeInTheDocument();
  });
});
