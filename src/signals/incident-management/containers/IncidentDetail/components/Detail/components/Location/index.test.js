import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import { withAppContext } from 'test/utils';

import Location from './index';

jest.mock('shared/services/list-helper/list-helper');

describe('<Location />', () => {
  let props;

  beforeEach(() => {
    getListValueByKey.mockImplementation(() => 'Centrum');

    props = {
      incident: {
        location: {
          extra_properties: null,
          geometrie: {
            type: 'Point',
            coordinates: [4.892649650573731, 52.36918517949316],
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
      },
      onShowLocation: jest.fn(),
      onEditLocation: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render correctly', async () => {
      const { findByText, queryByTestId, getByTestId } = render(withAppContext(<Location {...props} />));

      await findByText('Locatie');

      expect(queryByTestId('location-value-address-stadsdeel')).toHaveTextContent(/^Stadsdeel: Centrum$/);
      expect(queryByTestId('location-value-address-street')).toHaveTextContent(/^Rokin 123A-H$/);
      expect(queryByTestId('location-value-address-city')).toHaveTextContent(/^1012KP Amsterdam$/);
      expect(getByTestId('location-button-show')).toBeInTheDocument();
    });

    it('should render correctly without huisnummer_toevoeging', async () => {
      props.incident.location.address.huisnummer_toevoeging = undefined;
      const { findByTestId } = render(withAppContext(<Location {...props} />));

      const locAddress = await findByTestId('location-value-address-street');

      expect(locAddress).toHaveTextContent(/^Rokin 123A$/);
    });

    it('should render correctly without address', async () => {
      props.incident.location.address_text = undefined;
      const { findByTestId, queryByTestId } = render(withAppContext(<Location {...props} />));

      const pinned = await findByTestId('location-value-pinned');

      expect(pinned).toHaveTextContent(/^Locatie is gepind op de kaart$/);
      expect(queryByTestId('location-value-address-stadsdeel')).toBeNull();
      expect(queryByTestId('location-value-address-street')).toBeNull();
      expect(queryByTestId('location-value-address-city')).toBeNull();
    });
  });

  describe('events', () => {
    it('clicking the map should trigger showing the location', async () => {
      const { queryByTestId, findByTestId } = render(withAppContext(<Location {...props} />));

      act(() => {
        fireEvent.click(queryByTestId('location-button-show'));
      });

      await findByTestId('detail-location');

      expect(props.onShowLocation).toHaveBeenCalledTimes(1);
    });

    it('clicking the edit button should trigger edit the location', async () => {
      const { queryByTestId, findByTestId } = render(withAppContext(<Location {...props} />));

      act(() => {
        fireEvent.click(queryByTestId('location-button-edit'));
      });

      await findByTestId('detail-location');

      expect(props.onEditLocation).toHaveBeenCalledTimes(1);
    });
  });
});
