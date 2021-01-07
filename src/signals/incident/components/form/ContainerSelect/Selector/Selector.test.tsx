import type { ReactNode } from 'react';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Selector from './Selector';

import { ContainerSelectProvider } from '../context';
import { withAppContext } from 'test/utils';
import type { ContainerSelectValue } from '../types';


const contextValue: ContainerSelectValue = {
  selection: [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic container',
      iconUrl: '',
    },
  ],
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
};

export const withContext = (Component: ReactNode, context = contextValue) =>
  withAppContext(<ContainerSelectProvider value={context}>{Component}</ContainerSelectProvider>);

describe('signals/incident/components/form/ContainerSelect/Selector', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component', () => {
    render(withContext(<Selector />));

    expect(screen.queryByTestId('containerSelectSelector')).toBeInTheDocument();
    expect(screen.queryByText(/container toevoegen/i)).toBeInTheDocument();
    expect(screen.queryByText(/container verwijderen/i)).toBeInTheDocument();
    expect(screen.queryByText(/meld deze container\/sluiten/i)).toBeInTheDocument();
  });

  it('should call update when adding container', () => {
    render(withContext(<Selector />));
    expect(contextValue.update).not.toHaveBeenCalled();

    const element = screen.queryByText(/container toevoegen/i);
    if (element) fireEvent.click(element);
    expect(contextValue.update).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should call update when removing container', () => {
    render(withContext(<Selector />));
    expect(contextValue.update).not.toHaveBeenCalled();

    const element = screen.queryByText(/container verwijderen/i);
    if (element) fireEvent.click(element);
    expect(contextValue.update).toHaveBeenCalledWith(null);
  });

  it('should call close when closing the selector', () => {
    render(withContext(<Selector />));
    expect(contextValue.close).not.toHaveBeenCalled();

    const element = screen.queryByText(/meld deze container\/sluiten/i);
    if (element) fireEvent.click(element);
    expect(contextValue.close).toHaveBeenCalled();
  });
});
