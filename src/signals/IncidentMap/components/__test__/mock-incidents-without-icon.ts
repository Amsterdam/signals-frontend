// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import type { Incident } from '../../types'

export const mockIncidentsWithoutIcon: Incident[] = [
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
      icon: undefined,
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
      icon: undefined,
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
      icon: undefined,
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
      icon: undefined,
      created_at: '2022-`08-07T10:09:57.388602+00:00',
    },
  },
]
