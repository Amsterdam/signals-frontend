import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Selector from './Selector';
import fetchMock from 'jest-fetch-mock';
import containersJson from 'utils/__tests__/fixtures/containers.json';
import { contextValue, withContainerSelectContext } from '../ContainerSelectContext.test';

let showDesktopVariant = false;

jest.mock('@amsterdam/asc-ui/lib/utils/hooks', () => ({
  useMatchMedia: () => [showDesktopVariant],
}));

describe('signals/incident/components/form/ContainerSelect/Selector', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(containersJson), { status: 200 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component', async () => {
    render(withContainerSelectContext(<Selector />));

    expect(await screen.findByText(/container toevoegen/i)).toBeInTheDocument();
    expect(screen.getByText(/container verwijderen/i)).toBeInTheDocument();
    expect(screen.getByText(/meld deze container\/sluiten/i)).toBeInTheDocument();
  });

  it('should call update when adding container', async () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.update).not.toHaveBeenCalled();

    const element = await screen.findByText(/container toevoegen/i);
    if (element) fireEvent.click(element);
    expect(contextValue.update).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should call update when removing container', async () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.update).not.toHaveBeenCalled();

    const element = await screen.findByText(/container verwijderen/i);
    if (element) fireEvent.click(element);
    expect(contextValue.update).toHaveBeenCalledWith(null);
  });

  it('should call close when closing the selector', async () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.close).not.toHaveBeenCalled();

    const element = await screen.findByText(/meld deze container\/sluiten/i);
    if (element) fireEvent.click(element);
    expect(contextValue.close).toHaveBeenCalled();
  });

  it('should show desktop version on desktop', () => {
    showDesktopVariant = true;
    render(withContainerSelectContext(<Selector />));

    expect(screen.getByTestId('panel-desktop')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-mobile')).not.toBeInTheDocument();
  });

  it('should show mobile version on desktop', () => {
    showDesktopVariant = false;
    render(withContainerSelectContext(<Selector />));

    expect(screen.queryByTestId('panel-desktop')).not.toBeInTheDocument();
    expect(screen.getByTestId('panel-mobile')).toBeInTheDocument();
  });
});
