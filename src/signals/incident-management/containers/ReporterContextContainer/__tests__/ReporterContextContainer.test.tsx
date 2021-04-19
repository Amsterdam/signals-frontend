import React from 'react';
import * as reactRouterDom from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import ReporterContextContainer from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  id: '123',
}));

describe('ReporterContextContainer', () => {
  it('should render correctly', () => {
    render(withAppContext(<ReporterContextContainer />));

    expect(screen.getByText('hello world - incident 123')).toBeInTheDocument();
  });
});
