import React from 'react';
import { render, act } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import { IncidentContainerComponent } from '.';

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
  isAuthenticated: () => true,
}));
jest.mock('signals/incident/components/IncidentWizard', () => () => <span data-testid="incidentWizard" />);

describe('signals/incident/containers/IncidentContainer', () => {
  const props = {
    incidentContainer: { incident: {} },
    getClassificationAction: jest.fn(),
    updateIncidentAction: jest.fn(),
    createIncidentAction: jest.fn(),
  };

  it('should load wizard definition lazily', async () => {
    const { queryByTestId, getByTestId, findByTestId } = render(withAppContext(<IncidentContainerComponent {...props} />));

    expect(getByTestId('alertMessage')).toBeInTheDocument();
    expect(queryByTestId('incidentWizard')).not.toBeInTheDocument();

    let incidentWizard;

    await act(async () => {
      incidentWizard = await findByTestId('incidentWizard');
    });

    expect(incidentWizard).toBeInTheDocument();
  });
});
