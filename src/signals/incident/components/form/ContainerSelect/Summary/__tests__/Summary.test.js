import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ContainerSelectProvider } from 'signals/incident/components/form/ContainerSelect/context';
import { withAppContext } from 'test/utils';

import Summary from '..';

const contextValue = {
  selection: [
    {
      id: 'PL734',
      type: 'plastic',
      description: 'Plastic container',
    },
  ],
  meta: {
    featureTypes: [
      {
        label: 'Plastic',
        description: 'Plastic container',
        icon: {
          iconSvg: 'svg',
        },
        idField: 'id_nummer',
        typeField: 'fractie_omschrijving',
        typeValue: 'Plastic',
      },
    ],
  },
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
};

export const withContext = (Component, context = contextValue) =>
  withAppContext(<ContainerSelectProvider value={context}>{Component}</ContainerSelectProvider>);

describe('signals/incident/components/form/ContainerSelect/Summary', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render ', () => {
    render(withContext(<Summary />));

    expect(screen.queryByTestId('containerSelectSummary')).toBeInTheDocument();
    expect(screen.queryByTestId('containerList')).toBeInTheDocument();
    expect(screen.queryByText(/wijzigen/i)).toBeInTheDocument();
  });

  it('should call edit', () => {
    render(withContext(<Summary />));
    expect(contextValue.edit).not.toHaveBeenCalled();

    const element = screen.queryByText(/wijzigen/i);
    fireEvent.click(element);
    expect(contextValue.edit).toHaveBeenCalled();
  });
});
