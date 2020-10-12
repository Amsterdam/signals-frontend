import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import configuration from 'shared/services/configuration/configuration';

import 'jest-styled-components';

import Logo from '..';

jest.mock('shared/services/configuration/configuration');

describe('components/Logo', () => {
  beforeEach(() => {
    configuration.logo.url = 'https://logoipsum.com/logo/logo-8.svg';
    configuration.logo.width = '80px';
    configuration.logo.height = '80px';
    configuration.logo.smallWidth = '20%';
    configuration.logo.smallHeight = '40%';
  });

  afterEach(() => {
    configuration.__reset();
  });

  it('should render correctly', () => {
    const { container, getByTestId } = render(withAppContext(<Logo />));

    expect(container.querySelector(`a[href="${configuration.links.home}"]`)).toBeInTheDocument();
    expect(container.querySelector(`img[src="${configuration.logo.url}"]`)).toBeInTheDocument();
    expect(getByTestId('logo')).toHaveStyleRule('height', configuration.logo.height.toString());
    expect(getByTestId('logo')).toHaveStyleRule('width', configuration.logo.width.toString());
  });

  it('should render differently when not tall', () => {
    const { container, getByTestId } = render(withAppContext(<Logo tall={false} />));

    expect(container.querySelector('a[href="/"]')).toBeInTheDocument();
    expect(container.querySelector(`img[src="${configuration.logo.url}"]`)).toBeInTheDocument();
    expect(getByTestId('logo')).toHaveStyleRule('height', configuration.logo.smallHeight.toString());
    expect(getByTestId('logo')).toHaveStyleRule('width', configuration.logo.smallWidth.toString());
  });

  it('should render extra props', () => {
    const customTitle = 'Custom title';
    const { getByTitle } = render(withAppContext(<Logo title={customTitle} />));
    expect(getByTitle(customTitle)).toBeInTheDocument();
  });
});
