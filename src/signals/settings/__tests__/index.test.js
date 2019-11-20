import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext, withIntlAppContext } from 'test/utils';
import { isAuthenticated } from 'shared/services/auth/auth';

import SettingsModule from '..';
import translations from '../../../translations/nl.json';

jest.mock('shared/services/auth/auth');

describe('signals/settings', () => {
  it('should render the login page', () => {
    isAuthenticated.mockImplementation(() => false);
    const { getByTestId } = render(withAppContext(<SettingsModule />));

    expect(getByTestId('loginPage')).toBeInTheDocument();
  });

  it('should render the notFound page', () => {
    isAuthenticated.mockImplementation(() => true);
    const { getByTestId } = render(
      withIntlAppContext(<SettingsModule />, translations, 'nl')
    );

    expect(getByTestId('notFoundPage')).toBeInTheDocument();
  });
});
