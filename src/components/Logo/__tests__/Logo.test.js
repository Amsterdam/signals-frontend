import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import configuration from 'shared/services/configuration/configuration';

import Logo from '../index';

jest.mock('shared/services/configuration/configuration');

describe('components/Logo', () => {
  beforeEach(() => {
    configuration.logoUrl = 'https://logoipsum.com/logo/logo-8.svg';
    configuration.logoWidth = 80;
    configuration.logoHeight = 80;
    configuration.logoWidthSmall = 40;
    configuration.logoHeightSmall = 40;
  });

  afterEach(() => {
    configuration.__reset();
  });

  it('should render correctly', () => {
    const { container } = render(withAppContext(<Logo />));

    expect(container.querySelector(`a[href="${configuration.links.home}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[src="${configuration.logoUrl}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[height="${configuration.logoHeight}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[width="${configuration.logoWidth}"]`)).toBeInTheDocument();
  });

  it('should render the same when tall', () => {
    const { container } = render(withAppContext(<Logo tall />));

    expect(container.querySelector(`a[href="${configuration.links.home}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[src="${configuration.logoUrl}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[height="${configuration.logoHeight}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[width="${configuration.logoWidth}"]`)).toBeInTheDocument();
  });

  it('should render differently when not tall', () => {
    const { container } = render(withAppContext(<Logo tall={false} />));

    expect(container.querySelector(`a[href="/"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[src="${configuration.logoUrl}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[height="${configuration.logoHeightSmall}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[width="${configuration.logoWidthSmall}"]`)).toBeInTheDocument();
  });

  it('should render extra props', () => {
    const customTitle = 'Custom title';
    const { getByTitle } = render(withAppContext(<Logo title={customTitle} />));
    expect(getByTitle(customTitle)).toBeInTheDocument();
  });
});
