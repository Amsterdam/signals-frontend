import React from 'react';
import { render } from '@testing-library/react';
import { withIntlAppContext } from 'test/utils';

import NotFoundPage from './';
import messages from './messages';
import translations from '../../translations/nl.json';

describe('containers/NotFoundPage', () => {
  it('Renders header message', () => {
    const { getByText } = render(withIntlAppContext(<NotFoundPage />, translations, 'nl'));

    expect(getByText(translations[messages.header.id])).toBeTruthy();
  });
});
