import React from 'react';
import { FormBuilder } from 'react-reactive-form';
import { render } from '@testing-library/react';
import { withMapContext, withAppContext } from 'test/utils';
import context from 'containers/MapContext/context';

import LocationInput from '.';

const form = FormBuilder.group({
  location: {},
});

describe('incident-management/containers/IncidentDetail/components/LocationForm/components/LocationInput', () => {
  it('should render the location input control', () => {
    const { getByTestId } = render(
      withMapContext(
        <LocationInput
          locationControl={form.get('location')}
          handleSubmit={() => {}}
          onClose={() => {}}
          onQueryResult={() => {}}
        />
      )
    );

    expect(getByTestId('locationForm')).toBeInTheDocument();
    expect(getByTestId('mapInput')).toBeInTheDocument();
    expect(getByTestId('submitBtn')).toBeInTheDocument();
    expect(getByTestId('cancelBtn')).toBeInTheDocument();
  });

  it('should disable submit button when loading the map location', async () => {
    const { findByTestId, queryByTestId, rerender } = render(
      withAppContext(
        <context.Provider value={{ state: { loading: false }, dispatch: () => {} }}>
          <LocationInput
            locationControl={form.get('location')}
            handleSubmit={() => {}}
            onClose={() => {}}
            onQueryResult={() => {}}
          />
        </context.Provider>
      )
    );

    await findByTestId('locationForm');
    expect(queryByTestId('submitBtn').getAttribute('disabled')).not.toBeUndefined();

    rerender(
      withAppContext(
        <context.Provider value={{ state: { loading: true }, dispatch: () => {} }}>
          <LocationInput
            locationControl={form.get('location')}
            handleSubmit={() => {}}
            onClose={() => {}}
            onQueryResult={() => {}}
          />
        </context.Provider>
      )
    );

    await findByTestId('locationForm');
    expect(queryByTestId('submitBtn').getAttribute('disabled')).not.toBeUndefined();
  });
});
