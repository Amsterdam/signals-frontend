import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import LocationPreview from './index';

jest.mock('../MapDetail', () => () => <div data-testid="location-preview-map" />);

describe('<LocationPreview />', () => {
  const props = {
    location: {
      extra_properties: null,
      geometrie: {
        type: 'Point',
        coordinates: [
          4.892649650573731,
          52.36918517949316,
        ],
      },
      buurt_code: 'A00d',
      created_by: null,
      address: {
        postcode: '1012KP',
        huisletter: 'A',
        huisnummer: '123',
        woonplaats: 'Amsterdam',
        openbare_ruimte: 'Rokin',
        huisnummer_toevoeging: 'H',
      },
      stadsdeel: 'A',
      bag_validated: false,
      address_text: 'Rokin 123-H 1012KP Amsterdam',
      id: 3372,
    },
    onEditLocation: jest.fn(),
  };

  afterEach(cleanup);

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryAllByTestId } = render(
        withAppContext(
          <LocationPreview {...props} />)
      );

      expect(queryByTestId('location-preview-button-edit')).toHaveTextContent(/^Locatie wijzigen$/);
      expect(queryAllByTestId('location-preview-map')).toHaveLength(1);
    });
  });

  describe('events', () => {
    it('clicking the edit button should trigger edit the location', () => {
      const { queryByTestId } = render(
        withAppContext(
          <LocationPreview {...props} />
        )
      );
      fireEvent.click(queryByTestId('location-preview-button-edit'));

      expect(props.onEditLocation).toHaveBeenCalledTimes(1);
    });
  });
});
