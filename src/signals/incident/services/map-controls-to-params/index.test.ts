// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import formatISO from 'date-fns/formatISO'
import { mocked } from 'jest-mock'

import type { WizardSection } from 'signals/incident/definitions/wizard'
import { mock } from 'types/incident'

import mapControlsToParams from '.'
import mapPaths from '../map-paths'
import mapValues from '../map-values'

jest.mock('../map-values')
jest.mock('../map-paths')

const someDate = new Date('2018-07-21')
const incident = { ...mock, dateTime: someDate.getTime() }
const wizard: WizardSection = {
  beschrijf: {},
  vulaan: {},
  contact: {},
  summary: {},
  opslaan: {},
  bedankt: {},
  fout: {},
}

describe('map-controls-to-params', () => {
  beforeEach(() => {
    mocked(mapValues).mockImplementation((params) => params)
    mocked(mapPaths).mockImplementation((params) => params)
  })

  it('should map reporter and dateTime by default', () => {
    expect(mapControlsToParams(incident, wizard)).toEqual({
      reporter: {},
      incident_date_start: formatISO(incident.dateTime),
    })
  })

  it('should expect to receive values from paths and values services', () => {
    mocked(mapValues).mockImplementation((params) => ({
      ...params,
      varFromMapValues: 'foo',
    }))
    mocked(mapPaths).mockImplementation((params) => ({
      ...params,
      varFromMapPaths: 'bar',
    }))

    expect(mapControlsToParams(incident, wizard)).toEqual({
      reporter: {},
      incident_date_start: formatISO(incident.dateTime),
      varFromMapValues: 'foo',
      varFromMapPaths: 'bar',
    })
  })

  it('should return the current date when dateTime is `now`', () => {
    const incidentWithDateTimeNow = { ...mock, dateTime: 'now' }

    expect(mapControlsToParams(incidentWithDateTimeNow, wizard)).toEqual({
      reporter: {},
      incident_date_start: formatISO(Date.now()),
    })
  })

  it('should return the current date when dateTime is null', () => {
    const incidentWithDateTimeNull = { ...mock, dateTime: null }

    expect(mapControlsToParams(incidentWithDateTimeNull, wizard)).toEqual({
      reporter: {},
      incident_date_start: formatISO(Date.now()),
    })
  })
})
