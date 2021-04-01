// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import configuration from 'shared/services/configuration/configuration';
import { withAppContext } from 'test/utils';
import districts from 'utils/__tests__/fixtures/districts.json';

import IncidentDetailContext from '../../../../context';
import IncidentManagementContext from '../../../../../../context';

import Location from '.';

jest.mock('shared/services/configuration/configuration');

const props = {
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
    area_code: 'north',
    stadsdeel: 'A',
    bag_validated: false,
    address_text: 'Rokin 123-H 1012KP Amsterdam',
    id: 3372,
  },
  districts,
};

const preview = jest.fn();
const edit = jest.fn();

const renderWithContext = (locationProps = props) =>
  withAppContext(
    <IncidentManagementContext.Provider value={{ districts }}>
      <IncidentDetailContext.Provider value={{ preview, edit }}>
        <Location {...locationProps} />
      </IncidentDetailContext.Provider>
    </IncidentManagementContext.Provider>
  );

describe('<Location />', () => {
  beforeEach(() => {
    preview.mockReset();
    edit.mockReset();
  });

  afterEach(() => {
    configuration.__reset();
  });

  describe('rendering', () => {
    it('should render correctly', async () => {
      const { findByText, queryByTestId, getByTestId } = render(renderWithContext());

      await findByText('Locatie');

      expect(queryByTestId('location-value-address-district')).toHaveTextContent(/^Stadsdeel: Centrum$/);
      expect(queryByTestId('location-value-address-street')).toHaveTextContent(/^Rokin 123A-H$/);
      expect(queryByTestId('location-value-address-city')).toHaveTextContent(/^1012KP Amsterdam$/);
      expect(getByTestId('previewLocationButton')).toBeInTheDocument();
    });

    it('should render correctly with fetchDistrictsFromBackend', async () => {
      configuration.featureFlags.fetchDistrictsFromBackend = true;
      configuration.language.district = 'District';

      const { findByText, queryByTestId } = render(renderWithContext());

      await findByText('Locatie');

      expect(queryByTestId('location-value-address-district')).toHaveTextContent(/^District: North/);
    });

    describe('location preview', () => {
      it('should render static map image with useStaticMapServer enabled', async () => {
        configuration.featureFlags.useStaticMapServer = true;

        const { findByText, queryByTestId } = render(renderWithContext());

        await findByText('Locatie');

        expect(queryByTestId('mapStaticImage')).toBeInTheDocument();
        expect(queryByTestId('map-base')).not.toBeInTheDocument();
      });

      it('should render normal map with useStaticMapServer disabled', async () => {
        const { findByText, queryByTestId } = render(renderWithContext());

        await findByText('Locatie');

        expect(queryByTestId('mapStaticImage')).not.toBeInTheDocument();
        expect(queryByTestId('mapDetail')).toBeInTheDocument();
      });
    });

    it('should render correctly without huisnummer_toevoeging', async () => {
      const noToevoeging = {
        ...props,
        location: {
          ...props.location,
          address: {
            ...props.location.address,
            huisnummer_toevoeging: undefined,
          },
        },
      };
      const { findByTestId } = render(renderWithContext(noToevoeging));

      const locAddress = await findByTestId('location-value-address-street');

      expect(locAddress).toHaveTextContent(/^Rokin 123A$/);
    });

    it('should render correctly without address', async () => {
      const noAdressText = {
        ...props,
        location: {
          ...props.location,
          address_text: undefined,
        },
      };
      const { findByTestId, queryByTestId } = render(renderWithContext(noAdressText));

      const pinned = await findByTestId('location-value-pinned');

      expect(pinned).toHaveTextContent(/^Locatie is gepind op de kaart$/);
      expect(queryByTestId('location-value-address-district')).toBeInTheDocument();
      expect(queryByTestId('location-value-address-street')).not.toBeInTheDocument();
      expect(queryByTestId('location-value-address-city')).not.toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('clicking the map should trigger showing the location', async () => {
      const { queryByTestId, findByTestId } = render(renderWithContext());

      await findByTestId('previewLocationButton');

      expect(preview).not.toHaveBeenCalledTimes(1);

      act(() => {
        fireEvent.click(queryByTestId('previewLocationButton'));
      });

      await findByTestId('detail-location');

      expect(preview).toHaveBeenCalledWith('location');
    });

    it('clicking the edit button should trigger edit the location', async () => {
      const { queryByTestId, findByTestId } = render(renderWithContext());

      await findByTestId('editLocationButton');

      expect(edit).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(queryByTestId('editLocationButton'));
      });

      expect(edit).toHaveBeenCalledWith('location');
    });
  });
});
