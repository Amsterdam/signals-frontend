import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import { ContainerSelectProvider } from 'signals/incident/components/form/ContainerSelect/context';
import type { LatLngExpression } from 'leaflet';
import type { Meta } from '../../types';
import Intro from '../Intro';

const contextValue = {
  selection: [],
  meta: {} as Meta,
  location: [0, 0] as LatLngExpression,
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
};

export const withContext = (Component: JSX.Element, context = contextValue) =>
  withAppContext(<ContainerSelectProvider value={context}>{Component}</ContainerSelectProvider>);

describe('signals/incident/components/form/ContainerSelect/Intro', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component without the map', () => {
    render(withContext(<Intro />));

    expect(screen.getByTestId('containerSelectIntro')).toBeInTheDocument();
    expect(screen.queryByTestId('mapLocation')).not.toBeInTheDocument();
    expect(screen.getByTestId('chooseOnMap')).toBeInTheDocument();
  });

  it('should render the component with the map', () => {
    render(withContext(<Intro />, { ...contextValue, location: [1, 1] }));

    expect(screen.getByTestId('containerSelectIntro')).toBeInTheDocument();
    expect(screen.getByTestId('mapLocation')).toBeInTheDocument();
    expect(screen.getByTestId('chooseOnMap')).toBeInTheDocument();
  });

  it('should call edit', () => {
    render(withContext(<Intro />));
    expect(contextValue.edit).not.toHaveBeenCalled();

    const element = screen.getByTestId('chooseOnMap');
    fireEvent.click(element);
    expect(contextValue.edit).toHaveBeenCalled();
  });
});
