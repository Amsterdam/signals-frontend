import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import DetailPanel from '..';

describe('signals/incident-management/containes/IncidentOverviewPage/components/DetailPanel', () => {
  it('should render UI element', () => {
    const incidentId = 1234;
    const { container } = render(withAppContext(<DetailPanel incidentId={incidentId} onClose={() => {}} />));

    expect(container.querySelector(`a[href$="${incidentId}"]`)).toBeInTheDocument();
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should call onClose', () => {
    const onClose = jest.fn();
    const { container } = render(withAppContext(<DetailPanel incidentId={1234} onClose={onClose} />));

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(container.querySelector('button'));
    });

    expect(onClose).toHaveBeenCalled();
  });
});
