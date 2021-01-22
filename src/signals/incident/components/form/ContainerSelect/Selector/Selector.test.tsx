import React from 'react';
import { render, screen } from '@testing-library/react';
import Selector from './Selector';
import fetchMock from 'jest-fetch-mock';
import containersJson from 'utils/__tests__/fixtures/containers.json';
import { contextValue, withContainerSelectContext } from '../ContainerSelectContext.test';
import userEvent from '@testing-library/user-event';

let showDesktopVariant: boolean;
jest.mock('@amsterdam/asc-ui/lib/utils/hooks', () => ({
  useMatchMedia: () => [showDesktopVariant],
}));

describe('signals/incident/components/form/ContainerSelect/Selector', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(containersJson), { status: 200 });
    showDesktopVariant = false;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component', async () => {
    render(withContainerSelectContext(<Selector />));

    expect(await screen.findByTestId('containerSelectSelector')).toBeInTheDocument();
  });

  it('should call update when adding container', async () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.update).not.toHaveBeenCalled();

    const addContainerButton = await screen.findByText(/containers toevoegen/i);
    userEvent.click(addContainerButton);
    expect(contextValue.update).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should call update when removing container', async () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.update).not.toHaveBeenCalled();

    const removeContainersButton = await screen.findByText(/containers verwijderen/i);
    userEvent.click(removeContainersButton);
    expect(contextValue.update).toHaveBeenCalledWith([]);
  });

  it('should call close when closing the selector', async () => {
    render(withContainerSelectContext(<Selector />));
    expect(contextValue.close).not.toHaveBeenCalled();

    const button = await screen.findByText('Meld deze container');
    userEvent.click(button);
    expect(contextValue.close).toHaveBeenCalled();
  });

  it('should handle close button on legend panel', async () => {
    showDesktopVariant = true;
    render(withContainerSelectContext(<Selector />));

    userEvent.click(await screen.findByText('Legenda'));
    expect(screen.getByTestId('legend-panel')).toBeInTheDocument();

    userEvent.click(screen.getByTitle('Sluit'));
    expect(screen.queryByTestId('legend-panel')).not.toBeInTheDocument();
    expect(screen.queryByTestId('selection-panel')).toBeInTheDocument();
  });

  it('should render legend panel', async () => {
    showDesktopVariant = true;
    render(withContainerSelectContext(<Selector />));

    userEvent.click(await screen.findByText('Legenda'));

    expect(screen.getByTestId('legend-panel')).toBeInTheDocument();
  });

  it('should render selection panel', async () => {
    showDesktopVariant = true;
    render(withContainerSelectContext(<Selector />));

    expect(await screen.findByTestId('selection-panel')).toBeInTheDocument();
  });

  it('should show desktop version on desktop', async () => {
    showDesktopVariant = true;
    render(withContainerSelectContext(<Selector />));

    expect(await screen.findByTestId('panel-desktop')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-mobile')).not.toBeInTheDocument();
  });

  it('should show mobile version on desktop', async () => {
    render(withContainerSelectContext(<Selector />));

    expect(await screen.findByTestId('panel-mobile')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-desktop')).not.toBeInTheDocument();
  });
});
