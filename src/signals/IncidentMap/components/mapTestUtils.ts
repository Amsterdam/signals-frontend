// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
export const east = 4.899032528058569
export const north = 52.36966337175116
export const south = 52.36714374096002
export const west = 4.8958566562555035

export const mockGetBounds = jest.fn(() => ({
  getEast: () => east,
  getNorth: () => north,
  getSouth: () => south,
  getWest: () => west,
}))

export const mockUseMapInstance = {
  addLayer: jest.fn(),
  getBounds: mockGetBounds,
  removeLayer: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  getZoom: jest.fn(),
}

export const get = jest.fn()
export const patch = jest.fn()
export const post = jest.fn()
export const put = jest.fn()

export const useFetchResponse = {
  get,
  patch,
  post,
  put,
  data: undefined,
  isLoading: false,
  error: false,
  isSuccess: false,
}
