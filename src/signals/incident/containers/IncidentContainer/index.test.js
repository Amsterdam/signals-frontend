import React from 'react';
import { render, act } from '@testing-library/react';

import { history, withAppContext } from 'test/utils';
import { IncidentContainerComponent } from '.';

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
  isAuthenticated: () => true,
}));
jest.mock('signals/incident/components/IncidentWizard', () => () => <span />);

describe('signals/incident/containers/IncidentContainer', () => {
  const resetIncidentAction = jest.fn();
  const props = {
    incidentContainer: { incident: {} },
    getClassificationAction: jest.fn(),
    updateIncidentAction: jest.fn(),
    createIncidentAction: jest.fn(),
    resetIncidentAction,
  };

  it('should reset incident on page unload', () => {
    act(() => {
      history.push('/');
    });

    const { rerender } = render(withAppContext(<IncidentContainerComponent {...props} />));

    expect(resetIncidentAction).not.toHaveBeenCalled();

    act(() => {
      history.push('/incident/bedankt');
    });

    rerender(withAppContext(<IncidentContainerComponent {...props} />));

    expect(resetIncidentAction).not.toHaveBeenCalled();

    act(() => {
      history.push('/');
    });

    rerender(withAppContext(<IncidentContainerComponent {...props} />));

    expect(resetIncidentAction).toHaveBeenCalled();
  });
});
