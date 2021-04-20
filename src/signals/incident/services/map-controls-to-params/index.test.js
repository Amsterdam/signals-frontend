// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import mapValues from '../map-values'
import mapPaths from '../map-paths'

import mapControlsToParams from '.'

jest.mock('../map-values')
jest.mock('../map-paths')

describe('The map controls to params service', () => {
  beforeEach(() => {
    mapValues.mockImplementation((params) => params)
    mapPaths.mockImplementation((params) => params)
  })

  it('should map status by default', () => {
    expect(mapControlsToParams({}, {})).toEqual({ reporter: {} })
  })

  it('should map date: Nu', () => {
    const isodate = '2018-07-21T12:34:00+02:00'
    const dateMock = new Date(isodate)
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => dateMock)

    expect(
      mapControlsToParams(
        {
          incident_time_hours: 12,
          incident_time_minutes: 34,
          datetime: {
            id: 'Nu',
            label: 'Nu',
          },
        },
        {}
      )
    ).toEqual({
      reporter: {},
      incident_date_start: isodate,
    })

    spy.mockRestore()
  })

  it('should map date: Vandaag', () => {
    const isodate = '2018-07-21T10:21:00+02:00'
    const dateMock = new Date(isodate)
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => dateMock)
    global.Date.now = jest.fn(() => new Date(isodate).getTime())
    global.Date.UTC = jest.fn(() => new Date(isodate).getTime())

    expect(
      mapControlsToParams(
        {
          incident_time_hours: 10,
          incident_time_minutes: 21,
          incident_date: 'Vandaag',
        },
        {}
      )
    ).toEqual({
      reporter: {},
      incident_date_start: isodate,
    })
    spy.mockRestore()
  })

  it('should map date: fixed date', () => {
    const isodate = '2018-07-02T09:05:00+02:00'
    const testDate = '2018-04-02T09:05:00+02:00'
    const dateMock = new Date(isodate)
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => dateMock)
    global.Date.now = jest.fn(() => new Date(isodate).getTime())
    global.Date.UTC = jest.fn(() => new Date(isodate).getTime())

    expect(
      mapControlsToParams(
        {
          incident_time_hours: 9,
          incident_time_minutes: 5,
          incident_date: '2018-04-02',
        },
        {}
      )
    ).toEqual({
      reporter: {},
      incident_date_start: testDate,
    })
    spy.mockRestore()
  })

  it('should expect to receive values from paths and values services', () => {
    mapValues.mockImplementation((params) => ({
      ...params,
      varFromMapValues: 'foo',
    }))
    mapPaths.mockImplementation((params) => ({
      ...params,
      varFromMapPaths: 'bar',
    }))

    expect(mapControlsToParams({}, {})).toEqual({
      reporter: {},
      varFromMapValues: 'foo',
      varFromMapPaths: 'bar',
    })
  })
})
