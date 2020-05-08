import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';

import LocationForm from './index';

const coordinates = incidentFixture.location.geometrie.coordinates.join(',');

describe('incident-management/containers/IncidentDetail/components/LocationForm', () => {
  it('should render a form', () => {
    const { container, getByTestId } = render(
      withAppContext(<LocationForm incident={incidentFixture} onClose={() => {}} onPatchIncident={() => {}} />)
    );

    expect(getByTestId('locationForm')).toBeInTheDocument();
    expect(getByTestId('map-base')).toBeInTheDocument();
    expect(container.querySelector('[type=hidden]').value).toEqual(coordinates);
  });

  it('should call handlers', () => {
    const onClose = jest.fn();
    const onPatchIncident = jest.fn();
    const { queryByTestId } = render(
      withAppContext(<LocationForm incident={incidentFixture} onClose={onClose} onPatchIncident={onPatchIncident} />)
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
