import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import incidentJSON from 'utils/__tests__/fixtures/incident.json';
import { withAppContext } from 'test/utils';

import LocationPreview from './index';

jest.mock('../MapDetail', () => () => <div data-testid="location-preview-map" />);

describe('<LocationPreview />', () => {
  const props = {
    location: incidentJSON.location,
    onEditLocation: jest.fn(),
  };

  afterEach(cleanup);

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryAllByTestId } = render(
        withAppContext(<LocationPreview {...props} />)
      );

      expect(queryByTestId('location-preview-button-edit')).toHaveTextContent(/^Locatie wijzigen$/);
      expect(queryAllByTestId('location-preview-map')).toHaveLength(1);
    });
  });

  describe('events', () => {
    it('clicking the edit button should trigger edit the location', () => {
      const { queryByTestId } = render(
        withAppContext(<LocationPreview {...props} />)
      );
      fireEvent.click(queryByTestId('location-preview-button-edit'));

      expect(props.onEditLocation).toHaveBeenCalledTimes(1);
    });
  });
});
