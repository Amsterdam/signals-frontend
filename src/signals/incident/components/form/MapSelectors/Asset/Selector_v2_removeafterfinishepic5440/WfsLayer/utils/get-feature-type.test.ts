// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Feature } from 'geojson'

import { getFeatureType } from './get-feature-type'
import type { FeatureType } from '../../../../../../form/MapSelectors/types'

const mockGlasContainer: Feature = {
  type: 'Feature',
  id: 'container.16154',
  //   geometry_name: '16154',
  geometry: {
    type: 'Point',
    coordinates: [52.37209240253326, 4.900003434199737],
  },
  properties: {
    id: '16154',
    id_nummer: 'GLA00144',
    serienummer: '660512',
    cluster_id: '121821.017|487246.299',
    eigenaar_id: '112',
    eigenaar_naam: 'A Centrum',
    status: 1,
    fractie_code: '2',
    fractie_omschrijving: 'Glas',
    datum_creatie: '2012-03-29',
    datum_plaatsing: '2013-02-01',
    datum_operationeel: '2013-02-01',
    datum_aflopen_garantie: '2020-01-01',
    datum_oplevering: '2013-01-01',
    wijzigingsdatum_dp: '2023-12-05T18:09:17.602034+00:00',
    verwijderd_dp: false,
    geadopteerd_ind: true,
    locatie_id: '16153',
    type_id: '356',
    bag_hoofdadres_verblijfsobject_id: '0363010002005059',
    gbd_buurt_id: '03630980000060',
    bag_openbareruimte_id: '0363300000003878',
    bag_nummeraanduiding_id: '0363200002004858',
    container_ral_kleur_naam: null,
    container_ral_kleur_code: null,
    container_ral_kleur_hexcode: null,
    container_chip_nummber: null,
    container_unit_card_lezer_id: null,
    container_kleur: 'Gris 900 sable',
    container_mark: 3,
    container_datum_vervanging: '2023-01-01',
    container_datum_wijziging: '2023-07-02T22:00:00+00:00',
    container_end_of_life: null,
    container_eigenaarschap: 'Eigendom',
    container_eigenaarschap_opmerking: 'Container is in eigendom van de klant',
    container_opmerking: null,
  },
}

const mockFeatureTypes: FeatureType[] = [
  {
    label: 'Restafval',
    description: 'Restafval container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/rest.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Rest',
  },
  {
    label: 'Glas',
    description: 'Glas container',
    icon: {
      options: {
        className: 'object-marker',
        iconSize: [40, 40],
      },
      iconUrl: '/assets/images/afval/glas.svg',
    },
    idField: 'id_nummer',
    typeField: 'fractie_omschrijving',
    typeValue: 'Glas',
  },
]

describe('getFeatureType', () => {
  it('should return the correct feature type', () => {
    const result = getFeatureType(mockGlasContainer, mockFeatureTypes)

    expect(result).toEqual(mockFeatureTypes[1])
  })
})
