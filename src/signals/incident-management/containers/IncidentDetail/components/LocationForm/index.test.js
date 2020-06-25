import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import * as reactRedux from 'react-redux';

import { PATCH_TYPE_LOCATION } from 'models/incident/constants';
import { withMapContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import { patchIncident } from 'models/incident/actions';

import LocationForm from './index';

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

describe('incident-management/containers/IncidentDetail/components/LocationForm', () => {
  it('should render a form', () => {
    const { getByTestId } = render(
      withMapContext(
        <LocationForm
          incidentId={incidentFixture.id}
          location={incidentFixture.location}
          onClose={() => {}}
        />
      )
    );

    expect(getByTestId('locationForm')).toBeInTheDocument();
    expect(getByTestId('map-base')).toBeInTheDocument();
  });

  it('should call handlers', () => {
    const onClose = jest.fn();
    const { queryByTestId } = render(
      withMapContext(
        <LocationForm
          incidentId={incidentFixture.id}
          location={incidentFixture.location}
          onClose={onClose}
        />
      )
    );

    expect(onClose).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(queryByTestId('submitBtn'));
    });

    expect(dispatch).toHaveBeenCalledWith(
      patchIncident({
        id: incidentFixture.id,
        type: PATCH_TYPE_LOCATION,
        patch: { location: incidentFixture.location },
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
