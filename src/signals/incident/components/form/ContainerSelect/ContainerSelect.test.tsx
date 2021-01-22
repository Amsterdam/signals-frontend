import React from 'react';
import { render, screen } from '@testing-library/react';
import incidentJson from 'utils/__tests__/fixtures/incident.json';
import { withAppContext } from 'test/utils';
import type { ContainerSelectProps } from './ContainerSelect';
import ContainerSelect from './ContainerSelect';
import { initialValue } from './ContainerSelectContext';
import { withContainerSelectContext } from './ContainerSelectContext.test';
import type { Location } from 'types/incident';
import userEvent from '@testing-library/user-event';

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

    userEvent.click(screen.getByText(/kies op kaart/i));
    expect(screen.queryByTestId('containerSelectIntro')).not.toBeInTheDocument();
    expect(screen.queryByTestId('containerSelectSelector')).toBeInTheDocument();
  });

  it('should add container', () => {
    render(withContainerSelectContext(<ContainerSelect {...props} />));
    userEvent.click(screen.getByText(/kies op kaart/i));
    userEvent.click(screen.getByText(/containers toevoegen/i));
    expect(updateIncident).toHaveBeenCalled();
  });

  it('should close the selector component', () => {
    render(withContainerSelectContext(<ContainerSelect {...props} />));

    userEvent.click(screen.getByText(/kies op kaart/i));
    expect(screen.queryByTestId('containerSelectSelector')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('selector-close'));
    expect(screen.queryByTestId('containerSelectSelector')).not.toBeInTheDocument();
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
