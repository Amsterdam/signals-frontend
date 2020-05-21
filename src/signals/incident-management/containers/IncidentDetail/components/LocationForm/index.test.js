import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { withMapContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';

import LocationForm from './index';

describe('incident-management/containers/IncidentDetail/components/LocationForm', () => {
  it('should render a form', () => {
    const { getByTestId } = render(
      withMapContext(
        <LocationForm
          incidentId={incidentFixture.id}
          location={incidentFixture.location}
          onClose={() => {}}
          onPatchIncident={() => {}}
        />
      )
    );

    expect(getByTestId('locationForm')).toBeInTheDocument();
    expect(getByTestId('map-base')).toBeInTheDocument();
  });

  it('should call handlers', () => {
    const onClose = jest.fn();
    const onPatchIncident = jest.fn();
    const { queryByTestId } = render(
      withMapContext(
        <LocationForm
          incidentId={incidentFixture.id}
          location={incidentFixture.location}
          onClose={onClose}
          onPatchIncident={onPatchIncident}
        />
      )
    );

    expect(onClose).not.toHaveBeenCalled();
    expect(onPatchIncident).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(queryByTestId('submitBtn'));
    });

    expect(onPatchIncident).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
