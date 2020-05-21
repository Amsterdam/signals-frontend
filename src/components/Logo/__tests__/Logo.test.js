import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import configuration from 'shared/services/configuration/configuration';

import Logo from '../index';

jest.mock('shared/services/configuration/configuration');

describe('components/Logo', () => {
  beforeEach(() => {
    configuration.logoUrl = 'https://logoipsum.com/logo/logo-8.svg';
    configuration.logoHeight = 80;
  });

  afterEach(() => {
    configuration.__reset();
  });

  it('should render correctly', () => {
    const { container } = render(withAppContext(<Logo />));

    expect(container.querySelector(`a[href="${configuration.links.home}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[src="${configuration.logoUrl}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[height="${configuration.logoHeight}"]`)).toBeInTheDocument();
  });

  it('should render extra props', () => {
    const customTitle = 'Custom title';
    const { getByTitle } = render(withAppContext(<Logo title={customTitle} />));
    expect(getByTitle(customTitle)).toBeInTheDocument();
  });
});
