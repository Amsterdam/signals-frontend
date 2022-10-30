// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Feature } from 'geojson'

import type { Filter, Properties } from '../../types'
import { getFilteredIncidents } from './get-filtered-incidents'

const mockFilters: Filter[] = [
  {
    _display: 'Afval',
    filterActive: true,
    icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
    name: 'Afval',
    slug: 'afval',
    subCategories: [
      {
        _display: 'Container bijplaatsing (Afval)',
        filterActive: true,
        icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
        name: 'Container bijplaatsing',
        slug: 'container-bijplaatsing',
        nrOfIncidents: 3,
      },
      {
        _display: 'Container glas kapot (Afval)',
        filterActive: false,
        icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/container-glas-kapot/glas.svg?temp_url_sig=7b6c01926248bbb41d4de407f2e6a14f970d3d790ecc0d9ca6102bae2332e7c8&temp_url_expires=1665401494',
        name: 'Container glas kapot',
        slug: 'container-glas-kapot',
        nrOfIncidents: 1,
      },
    ],
    nrOfIncidents: 1,
  },
  {
    _display: 'Openbaar groen en water',
    filterActive: true,
    icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
    name: 'Openbaar groen en water',
    slug: 'openbaar-groen-en-water',
    nrOfIncidents: 6,
  },
]

const mockIncidents: Feature<any, Properties>[] = [
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
        name: 'Openbaar groen en water',
        slug: 'openbaar-groen-en-water',
        parent: {
          name: 'Openbaar groen en water',
          slug: 'openbaar groen en water',
        },
      },
      icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
      created_at: '2022-`08-07T10:09:57.388602+00:00',
    },
  },
]

describe('getFilteredIncidents', () => {
  it('should return only active filters', () => {
    const result = getFilteredIncidents(mockFilters, mockIncidents)

    expect(result.length).toEqual(3)
  })
})
