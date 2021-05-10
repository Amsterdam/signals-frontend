// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import proj4 from 'proj4'

const config = {
  rd: {
    code: 'EPSG:28992',
    projection:
      '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +' +
      'y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.3507326' +
      '76542563,-1.8703473836068,4.0812 +no_defs',
    transformation: {
      resolutions: [
        3440.64,
        1720.32,
        860.16,
        430.08,
        215.04,
        107.52,
        53.76,
        26.88,
        13.44,
        6.72,
        3.36,
        1.68,
        0.84,
        0.42,
        0.21,
        0.105,
        0.0525,
      ],
      bounds: [
        [-285401.92, 22598.08],
        [595301.9199999999, 903301.9199999999],
      ],
      origin: [-285401.92, 22598.08],
    },
  },
  wgs84: {
    code: 'EPSG:4326',
    projection: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
  },
  earthRadius: 6378137, // The radius in meters
}

/**
 * Converts the given WGS84 coordinates (lat, lon) to RD coordinates.
 *
 * Please mind: x is lon (4.xxx) and y is lat (52.xxx).
 *
 * @params {Object.<string, number>} wgs84Coordinates with keys `latitude` and
 * `longitude`.
 *
 * @returns {Object.<string, number>} RD coordinates with keys `x` and `y`.
 */
export const wgs84ToRd = (wgs84Coordinates) => {
  const rdCoordinates = proj4(config.rd.projection, [
    wgs84Coordinates.lng,
    wgs84Coordinates.lat,
  ])

  return {
    x: rdCoordinates[0],
    y: rdCoordinates[1],
  }
}

/**
 * Converts the given RD coordinates to WGS84 coordinates (lat, lon).
 *
 * Please mind: x is lon (4.xxx) and y is lat (52.xxx).
 *
 * @params {Object.<string, number>} rdCoordinates with keys `x` and `y`.
 *
 * @returns {Object.<string, number>} WGS84 coordinates with keys `latitude`
 * and `longitude`.
 */
export const rdToWgs84 = (rdCoordinates) => {
  const wgs84Coordinates = proj4(
    config.rd.projection,
    config.wgs84.projection,
    [rdCoordinates.x, rdCoordinates.y]
  )
  return {
    lat: wgs84Coordinates[1],
    lng: wgs84Coordinates[0],
  }
}
