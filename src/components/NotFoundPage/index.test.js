import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import NotFoundPage from '.';

describe('components/NotFoundPage', () => {
  it('Renders header message', () => {
    const { getByText } = render(withAppContext(<NotFoundPage />));

    expect(getByText('Pagina niet gevonden')).toBeInTheDocument();
  });
});
