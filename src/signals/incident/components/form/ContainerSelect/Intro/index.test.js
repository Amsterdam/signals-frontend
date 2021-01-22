import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Intro from '.';

import { ContainerSelectProvider } from '../context';
import { withAppContext } from 'test/utils';

const contextValue = { selection: [], location: null, update: jest.fn(), edit: jest.fn(), close: jest.fn() };

export const withContext = (Component, context = contextValue) =>
  withAppContext(<ContainerSelectProvider value={context}>{Component}</ContainerSelectProvider>);

describe('signals/incident/components/form/ContainerSelect/Intro', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component without the map', () => {
    render(withContext(<Intro />));

    expect(screen.queryByTestId('containerSelectIntro')).toBeInTheDocument();
    expect(screen.queryByTestId('mapLocation')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chooseOnMap')).toBeInTheDocument();
  });

  it('should render the component with the map', () => {
    render(withContext(<Intro />, { ...contextValue, location: [1, 1] }));

    expect(screen.queryByTestId('containerSelectIntro')).toBeInTheDocument();
    expect(screen.queryByTestId('mapLocation')).toBeInTheDocument();
    expect(screen.queryByTestId('chooseOnMap')).toBeInTheDocument();
  });

  it('should call edit', () => {
    render(withContext(<Intro />));
    expect(contextValue.edit).not.toHaveBeenCalled();

    const element = screen.queryByTestId('chooseOnMap');
    fireEvent.click(element);
    expect(contextValue.edit).toHaveBeenCalled();
  });
});
