import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import incidentJson from 'utils/__tests__/fixtures/incident.json';
import { withAppContext } from 'test/utils';
import type { ContainerSelectProps } from './ContainerSelect';
import ContainerSelect from './ContainerSelect';
import { initialValue } from './ContainerSelectContext';
import { withContainerSelectContext } from './ContainerSelectContext.test';
import type { Location } from 'types/incident';

// prevent fetch requests that we don't need to verify
jest.mock('./WfsLayer', () => () => <span data-testid="wfsLayer" />);

describe('signals/incident/components/form/ContainerSelect', () => {
  let props: ContainerSelectProps;
  const updateIncident = jest.fn();
  const location = incidentJson.location as Location;
  beforeEach(() => {
    props = {
      handler: () => ({
        value: [],
      }),
      meta: initialValue.meta,
      parent: {
        meta: {
          incidentContainer: { incident: { location } },
          updateIncident,
        },
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
    render(withContainerSelectContext(<ContainerSelect {...props} />));

    fireEvent.click(screen.getByText(/kies op kaart/i));
    expect(screen.queryByTestId('containerSelectIntro')).not.toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSelector')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/meld deze container\/sluiten/i));
    expect(screen.queryByTestId('containerSelectIntro')).toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSelector')).not.toBeInTheDocument();
  });

  it('should add container', () => {
    render(withContainerSelectContext(<ContainerSelect {...props} />));
    fireEvent.click(screen.getByText(/kies op kaart/i));
    fireEvent.click(screen.getByText(/container toevoegen/i));
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
