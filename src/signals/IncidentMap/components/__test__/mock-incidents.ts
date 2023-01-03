// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import type { Incident } from '../../types'

export const mockIncidentsShort: Incident[] = [
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [4.85690630125273, 52.377059704057],
    },
    properties: {
      category: {
        name: 'Afval',
        slug: 'afval',
        parent: {
          name: 'Afval',
          slug: 'afval',
        },
      },
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
      created_at: '2022-09-08T10:09:57.388602+00:00',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [4.85690630125173, 52.377059704157],
    },
    properties: {
      category: {
        name: 'Container bijplaatsing',
        slug: 'container-bijplaatsing',
        parent: {
          name: 'Afval',
          slug: 'afval',
        },
      },
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
      created_at: '2022-09-07T10:09:57.388602+00:00',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [4.85690630125153, 52.377059704177],
    },
    properties: {
      category: {
        name: 'Container glas kapot',
        slug: 'container-glas-kapot',
        parent: {
          name: 'Afval',
          slug: 'afval',
        },
      },
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
      created_at: '2022-10-07T10:09:57.388602+00:00',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [4.85690630125157, 52.377059704173],
    },
    properties: {
      category: {
        name: 'Eikenprocessierups',
        slug: 'eikenprocessierups',
        parent: {
          name: 'Openbaar groen en water',
          slug: 'openbaar-groen-en-water',
        },
      },
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
      created_at: '2022-`08-07T10:09:57.388602+00:00',
    },
  },
]

export const mockIncidentsLong: Incident[] = [
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
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
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
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/schoon/onderhoud.svg?temp_url_sig=04ee5fd350a9dc3dd1c6df035ebd61eb008654f62e46c7a079a4288e90ea2a47&temp_url_expires=1665401495',
      created_at: '2022-09-06T14:18:11.37237+00:00',
    },
  },
]
