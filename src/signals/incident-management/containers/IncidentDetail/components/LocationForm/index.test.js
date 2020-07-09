import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';

import { PATCH_TYPE_LOCATION } from 'models/incident/constants';
import { withMapContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';

import IncidentDetailContext from '../../context';
import LocationForm from './index';

const dispatch = jest.fn();

const renderWithContext = (props = {}, incident = incidentFixture) =>
  withMapContext(
    <IncidentDetailContext.Provider value={{ incident, dispatch }}>
      <LocationForm {...props} />
    </IncidentDetailContext.Provider>
  );

describe('incident-management/containers/IncidentDetail/components/LocationForm', () => {
  it('should render a form', () => {
    const { getByTestId } = render(
      renderWithContext({ onClose: () => {} })
    );

    expect(getByTestId('locationForm')).toBeInTheDocument();
    expect(getByTestId('map-base')).toBeInTheDocument();
  });

  it('should call handlers', () => {
    const onClose = jest.fn();
    const { queryByTestId } = render(
      renderWithContext({ onClose })
    );

    expect(onClose).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(queryByTestId('submitBtn'));
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: PATCH_TYPE_LOCATION,
      patch: { location: incidentFixture.location },
    });

    expect(onClose).toHaveBeenCalled();
  });
});
