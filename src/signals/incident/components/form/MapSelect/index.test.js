import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withAppContext } from 'test/utils';

import MapSelect from '.';

const jsonResponse = {
  type: 'FeatureCollection',
  name: 'verlichting',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
  features: [
    {
      type: 'Feature',
      properties: { ogc_fid: '1845', type_id: '5', type_name: 'Grachtmast', objectnummer: '002635' },
      geometry: { type: 'Point', coordinates: [4.896506, 52.370984] },
    },
    {
      type: 'Feature',
      properties: { ogc_fid: '1882', type_id: '5', type_name: 'Grachtmast', objectnummer: '147329' },
      geometry: { type: 'Point', coordinates: [4.895565, 52.371467] },
    },
  ],
};

describe('signals/incident/components/form/MapSelect', () => {
  const parent = {
    meta: {
      updateIncident: jest.fn(),
    },
  };

  const meta = {
    name: 'my_question',
    isVisible: true,
    endpoint: 'foo/bar?',
    idField: 'objectnummer',
  };

  const handler = () => ({ value: 'foo' });

  describe('rendering', () => {
    it('should render the map component', () => {
      const { container, queryByTestId, rerender } = render(
        withAppContext(<MapSelect parent={parent} meta={meta} handler={handler} />)
      );

      expect(queryByTestId('mapSelect')).toBeInTheDocument();
      expect(queryByTestId('gpsButton')).toBeInTheDocument();
      expect(container.firstChild.classList.contains('mapSelect')).toBeTruthy();

      rerender(withAppContext(<MapSelect parent={parent} meta={{ ...meta, isVisible: false }} handler={handler} />));

      expect(queryByTestId('mapSelect')).not.toBeInTheDocument();
    });

    it('should render with incident coordinates', () => {
      const parentWithCoordinates = {
        ...parent,
        meta: {
          ...parent.meta,
          incidentContainer: {
            incident: {
              location: {
                geometrie: {
                  coordinates: [4, 52],
                },
              },
            },
          },
        },
      };
      render(withAppContext(<MapSelect parent={parentWithCoordinates} meta={meta} handler={handler} />));

      expect(screen.getByTestId('mapSelect')).toBeInTheDocument();
    });

    it('should render selected item numbers', () => {
      const { getByText } = render(
        withAppContext(<MapSelect parent={parent} meta={meta} handler={() => ({ value: ['9673465', '808435'] })} />)
      );

      expect(getByText('Het gaat om: 9673465; 808435')).toBeInTheDocument();
    });

    it('should render selected item numbers with custom label', () => {
      const { getByText } = render(
        withAppContext(
          <MapSelect
            parent={parent}
            meta={{
              ...meta,
              selectionLabel: 'lamp of lantaarnpaal met nummer',
            }}
            handler={() => ({ value: ['9673465', '808435'] })}
          />
        )
      );

      expect(getByText('Het gaat om lamp of lantaarnpaal met nummer: 9673465; 808435')).toBeInTheDocument();
    });

    it('should call parent.meta.updateIncident', async () => {
      fetch.mockResponse(JSON.stringify(jsonResponse));

      const value = ['002635', '147329'];
      const { findByTestId } = render(
        withAppContext(<MapSelect parent={parent} meta={meta} handler={() => ({ value })} />)
      );

      await findByTestId('mapSelect');

      expect(parent.meta.updateIncident).not.toHaveBeenCalled();

      userEvent.click(screen.getByRole('img', { name: value[0] }));

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({ [meta.name]: [value[1]] });
    });
  });
});
