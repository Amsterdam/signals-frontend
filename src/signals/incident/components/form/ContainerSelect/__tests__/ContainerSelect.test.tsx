import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import incidentJson from 'utils/__tests__/fixtures/incident.json';
import { withAppContext } from 'test/utils';
import { withContainerSelectContext } from './context.test';
import type { Location } from 'types/incident';
import type { ContainerSelectProps } from '../ContainerSelect';
import ContainerSelect from '..';
import { initialValue } from '../context';

// prevent fetch requests that we don't need to verify
jest.mock('../Selector/WfsLayer', () => () => <span data-testid="wfsLayer" />);

describe('ContainerSelect', () => {
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

  it('should close the selector component', () => {
    render(withContainerSelectContext(<ContainerSelect {...props} />));

    userEvent.click(screen.getByText(/kies op kaart/i));
    expect(screen.queryByTestId('containerSelectSelector')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('selectorClose'));
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
