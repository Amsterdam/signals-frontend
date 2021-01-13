import type { ReactNode, ReactPortal } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Selector from './Selector';
import type { FetchMock } from 'jest-fetch-mock';
import containersJson from 'utils/__tests__/fixtures/containers.json';
import { controls } from 'signals/incident/definitions/wizard-step-2-vulaan/afval';
import { ContainerSelectProvider } from '../context';
import { withAppContext } from 'test/utils';
import type { ContainerSelectValue } from '../types';

const fetchMock = fetch as FetchMock;

ReactDOM.createPortal = node => node as ReactPortal;

const { endpoint, featureTypes } = controls.extra_container.meta;

const contextValue: ContainerSelectValue = {
  selection: [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic container',
      iconUrl: '',
    },
  ],
  location: [0, 0],
  meta: { endpoint, featureTypes },
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
};

const withContext = (Component: ReactNode, context = contextValue) => withAppContext(<ContainerSelectProvider value={context}><div id="app">{Component}</div></ContainerSelectProvider>);

describe('signals/incident/components/form/ContainerSelect/Selector', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(containersJson), { status: 200 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component', async() => {
    render(withContext(<Selector />));

    expect(await screen.findByTestId('containerSelectSelector')).toBeInTheDocument();
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
