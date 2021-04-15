// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import proj4 from 'proj4';
import { wgs84ToRd, rdToWgs84 } from './crs-converter';

jest.mock('proj4');

describe('The CRS converter service', () => {
  afterEach(() => {
    proj4.mockReset();
  });

  it('can convert from WGS84 to RD coordinates', () => {
    proj4.mockImplementation(() => [3, 4]);

    const wgs84Coordinates = {
      lat: 1,
      lng: 0,
    };
    const actual = wgs84ToRd(wgs84Coordinates);

    expect(proj4.mock.calls[0][1]).toEqual([0, 1]);
    expect(actual).toEqual({ x: 3, y: 4 });
  });

  it('can convert from RD to WGS84 coordinates', () => {
    proj4.mockImplementation(() => [3, 4]);

    const rdCoordinates = { x: 1, y: 0 };
    const actual = rdToWgs84(rdCoordinates);

    expect(proj4.mock.calls[0][2]).toEqual([1, 0]);
    expect(actual).toEqual({
      lat: 4,
      lng: 3,
    });
  });
});
