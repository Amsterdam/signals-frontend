// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import formatISO from 'date-fns/formatISO'
import { mock } from 'types/incident'

import mapValues from '../map-values'
import mapPaths from '../map-paths'

import mapControlsToParams from '.'

jest.mock('../map-values')
jest.mock('../map-paths')

const someDate = new Date('2018-07-21')
const incident = { ...mock, dateTime: someDate.getTime() }

describe('The map controls to params service', () => {
  beforeEach(() => {
    mapValues.mockImplementation((params) => params)
    mapPaths.mockImplementation((params) => params)
  })

  it('should map reporter and dateTime by default', () => {
    expect(mapControlsToParams(incident, {})).toEqual({
      reporter: {},
      incident_date_start: formatISO(incident.dateTime),
    })
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

    expect(mapControlsToParams(incident, {})).toEqual({
      reporter: {},
      incident_date_start: formatISO(incident.dateTime),
      varFromMapValues: 'foo',
      varFromMapPaths: 'bar',
    })
  })
})
