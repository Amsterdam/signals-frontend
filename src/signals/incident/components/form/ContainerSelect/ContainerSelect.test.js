import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import ContainerSelect from './ContainerSelect';
describe('signals/incident/components/form/ContainerSelect', () => {
  let props;
  const updateIncident = jest.fn();

  beforeEach(() => {
    props = {
      handler: () => ({
        value: null,
      }),
      parent: {
        meta: { updateIncident },
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the Intro', () => {
    render(withAppContext(<ContainerSelect {...props} />));

    expect(screen.queryByTestId('containerSelectIntro')).toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSelector')).not.toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSummary')).not.toBeInTheDocument();
  });

  it('should render the Selector', () => {
    render(withAppContext(<ContainerSelect {...props} />));

    fireEvent.click(screen.queryByText(/kies op kaart/i));
    expect(screen.queryByTestId('containerSelectIntro')).not.toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSelector')).toBeInTheDocument();

    fireEvent.click(screen.queryByText(/meld deze container\/sluiten/i));
    expect(screen.queryByTestId('containerSelectIntro')).toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSelector')).not.toBeInTheDocument();
  });

  it('should add container', () => {
    render(withAppContext(<ContainerSelect {...props} />));
    fireEvent.click(screen.queryByText(/kies op kaart/i));
    fireEvent.click(screen.queryByText(/container toevoegen/i));
    expect(updateIncident).toHaveBeenCalled();
  });

  it('should render the Summary', () => {
    render(
      withAppContext(
        <ContainerSelect
          {...{
            ...props,
            handler: () => ({
              value: [
                {
                  id: 'PL734',
                  type: 'plastic',
                  description: 'Plastic container',
                  iconUrl: '',
                },
              ],
            }),
          }}
        />
      )
    );

    expect(screen.queryByTestId('containerSelectIntro')).not.toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSelector')).not.toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSummary')).toBeInTheDocument();
  });
});
