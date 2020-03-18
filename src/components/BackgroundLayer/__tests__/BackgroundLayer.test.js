import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as reactMaps from '@datapunt/react-maps';
import BackgoundLayer from '..';

describe('src/components/BackgroundLayer', () => {
  it('should render the TileLayer', () => {
    jest.spyOn(reactMaps, 'TileLayer').mockImplementation(() => 'TileLayerMock');
    const { getByText } = render(withAppContext(<BackgoundLayer />));

    expect(getByText('TileLayerMock')).toBeInTheDocument();
    expect(reactMaps.TileLayer).toHaveBeenCalledTimes(1);
    expect(reactMaps.TileLayer).toHaveBeenCalledWith(
      {
        args: ['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png'],
        options: {
          attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
          subdomains: ['t1', 't2', 't3', 't4'],
          tms: true,
        },
      }
      ,{}
    );
  });
});
