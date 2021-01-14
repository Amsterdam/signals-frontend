import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Selector from './Selector';
import type { FetchMock } from 'jest-fetch-mock';
import containersJson from 'utils/__tests__/fixtures/containers.json';
import { contextValue, withContainerSelectContext } from '../context.test';

const fetchMock = fetch as FetchMock;

describe('signals/incident/components/form/ContainerSelect/Selector', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(containersJson), { status: 200 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component', async() => {
    render(withContainerSelectContext(<Selector />));

    expect(await screen.findByTestId('containerSelectSelector')).toBeInTheDocument();
    expect(screen.queryByText(/container toevoegen/i)).toBeInTheDocument();
    expect(screen.queryByText(/container verwijderen/i)).toBeInTheDocument();
    expect(screen.queryByText(/meld deze container\/sluiten/i)).toBeInTheDocument();
  });

  it('should call update when adding container', () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.update).not.toHaveBeenCalled();

    const element = screen.queryByText(/container toevoegen/i);
    if (element) fireEvent.click(element);
    expect(contextValue.update).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should call update when removing container', () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.update).not.toHaveBeenCalled();

    const element = screen.queryByText(/container verwijderen/i);
    if (element) fireEvent.click(element);
    expect(contextValue.update).toHaveBeenCalledWith(null);
  });

  it('should call close when closing the selector', () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.close).not.toHaveBeenCalled();

    const element = screen.queryByText(/meld deze container\/sluiten/i);
    if (element) fireEvent.click(element);
    expect(contextValue.close).toHaveBeenCalled();
  });
});
