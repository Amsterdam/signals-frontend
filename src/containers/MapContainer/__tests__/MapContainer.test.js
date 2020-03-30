import React, { useContext, useEffect } from 'react';
import { render } from '@testing-library/react';
import { initialState } from '../reducer';
import MapContainer from '..';
import MapContext from '../context';
import { setValuesAction } from '../actions';

describe('containers/MapContext/index', () => {
  const testLocation = { lat: 42, lng: 4 };
  const TestComponent = ({ value }) => {
    const { state, dispatch } = useContext(MapContext);

    useEffect(() => {
      if (value) dispatch(setValuesAction(value));
    }, [value, dispatch]);

    return JSON.stringify(state);
  };

  it('should render the test component', () => {
    const testValue = JSON.stringify(initialState);
    const { queryByText, rerender } = render(
      <MapContainer>
        <TestComponent />
      </MapContainer>
    );

    expect(queryByText(testValue)).toBeInTheDocument();

    const rerenderTestValue = JSON.stringify({
      ...initialState,
      location: testLocation,
    });

    rerender(
      <MapContainer>
        <TestComponent value={{ location:testLocation }} />
      </MapContainer>
    );

    expect(queryByText(rerenderTestValue)).toBeInTheDocument();
  });
});
