// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { RawData } from './types'
import {
  getQueryList,
  formatData,
  getTotalNrOfIncidents,
  getMaxDomain,
} from './utils'
import type { BarChartValue } from '../../charts'

const mockRawData: RawData[] = [
  {
    total: 81,
    results: [],
  },
  {
    total: 131,
    results: [],
  },
  {
    total: 132,
    results: [],
  },
  {
    total: 78,
    results: [],
  },
  {
    total: 57,
    results: [],
  },
  {
    total: 559,
    results: [],
  },
  {
    total: 387,
    results: [],
  },
  {
    total: 0,
    results: [],
  },
  {
    total: 6513,
    results: [],
  },
  {
    total: 1948,
    results: [],
  },
  {
    total: 75,
    results: [],
  },
]

const mockFormatedData: BarChartValue[] = [
  {
    status: 'Heropend',
    nrOfIncidents: 81,
  },
  {
    status: 'Extern: afgehandeld',
    nrOfIncidents: 131,
  },
  {
    status: 'Ingepland',
    nrOfIncidents: 132,
  },
  {
    status: 'Verzoek tot heropenen',
    nrOfIncidents: 78,
  },
  {
    status: 'Reactie ontvangen',
    nrOfIncidents: 57,
  },
  {
    status: 'In behandeling',
    nrOfIncidents: 559,
  },
  {
    status: 'Gesplitst',
    nrOfIncidents: 387,
  },
  {
    status: 'Reactie gevraagd',
    nrOfIncidents: 0,
  },
  {
    status: 'Gemeld',
    nrOfIncidents: 6513,
  },
  {
    status: 'Afwachting van behandeling',
    nrOfIncidents: 1948,
  },
  {
    status: 'Extern: verzoek tot afhandeling',
    nrOfIncidents: 75,
  },
]

describe('utils', () => {
  describe('getQueryList', () => {
    it('should return an array of queries with only status', () => {
      const result = getQueryList('')

      expect(result).toEqual([
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=reopened',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=done+external',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=ingepland',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=reopen+requested',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=reaction+received',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=b',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=s',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=reaction+requested',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=m',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=i',
        'http://localhost:8000/signals/v1/private/signals/stats/total?status=closure+requested',
      ])
    })

    it('should return an array of queries with querystring concatenated', () => {
      const result = getQueryList('category_slug=rolcontainer-is-vol')

      expect(result).toEqual([
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=reopened',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=done+external',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=ingepland',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=reopen+requested',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=reaction+received',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=b',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=s',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=reaction+requested',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=m',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=i',
        'http://localhost:8000/signals/v1/private/signals/stats/total?category_slug=rolcontainer-is-vol&status=closure+requested',
      ])
    })
  })

  describe('formatData', () => {
    it('should return rawData in formated data', () => {
      const result = formatData(mockRawData)

      expect(result).toEqual(mockFormatedData)
    })
  })

  describe('getTotalNrOfIncidents', () => {
    const result = getTotalNrOfIncidents(mockRawData)

    expect(result).toEqual(9961)
  })

  describe('getMaxDomain', () => {
    const result = getMaxDomain(mockFormatedData)

    expect(result).toEqual(6513)
  })
})
