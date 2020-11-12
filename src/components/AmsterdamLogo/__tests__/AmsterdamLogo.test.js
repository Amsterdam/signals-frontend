import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import { AmsterdamLogo } from '@amsterdam/asc-ui';

describe('components/AmsterdamLogo', () => {
  it('should render correctly', () => {
    const homeLink = 'https://home-link';
    const { container, queryByText } = render(withAppContext(<AmsterdamLogo href={homeLink} />));

    expect(container.querySelector(`a[href="${homeLink}"]`)).toBeInTheDocument();
    expect(queryByText('Gemeente Amsterdam')).toBeInTheDocument();
  });
});
