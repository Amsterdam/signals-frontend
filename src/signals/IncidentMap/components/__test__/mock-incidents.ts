import type { Feature } from 'geojson'

import type { Point, Properties } from '../../types'

export const mockIncidents: Feature<Point, Properties>[] = [
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [4.85690630125173, 52.377059704157],
    },
    properties: {
      category: {
        name: 'Restafval container is kapot of vol. Of er is iets anders aan de hand. In elk geval er kan niks meer in de container.',
        slug: 'test',
        parent: {
          name: 'Restafval',
          slug: 'afval',
        },
      },
      created_at: '2022-09-07T10:09:57.388602+00:00',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [4.89256897274903, 52.37800347191],
    },
    properties: {
      category: {
        name: 'Test-2',
        slug: 'test',
        parent: {
          name: 'Test 2',
          slug: 'overig',
        },
      },
      created_at: '2022-09-07T10:09:36.656933+00:00',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [4.89561471811608, 52.3703342425247],
    },
    properties: {
      category: {
        name: 'Test 3',
        slug: 'test',
        parent: {
          name: 'Test 3',
          slug: 'schoon',
        },
      },
      created_at: '2022-09-06T14:18:11.37237+00:00',
    },
  },
]
