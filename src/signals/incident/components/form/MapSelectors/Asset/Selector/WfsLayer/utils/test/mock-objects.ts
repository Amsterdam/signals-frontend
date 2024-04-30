// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Feature as FeaturesGeo } from 'geojson'

import type { Feature } from '../../../../../types'

export const mockContainers: Feature[] = [
  {
    type: 'Feature',
    id: 'container.184574',
    geometry_name: '184574',
    geometry: {
      type: 'Point',
      coordinates: [52.37585547675836, 4.89321686975306],
    },
    properties: {
      id: '184574',
      id_nummer: 'PAA00210',
      serienummer: 'HBD.2022.2853',
      cluster_id: '121361.350|487667.794',
      eigenaar_id: '112',
      eigenaar_naam: 'A Centrum',
      status: 1,
      fractie_code: '3',
      fractie_omschrijving: 'Papier',
      datum_creatie: '2022-03-15',
      datum_plaatsing: '2023-02-01',
      datum_operationeel: '2023-12-12',
      datum_aflopen_garantie: '2032-12-01',
      datum_oplevering: '2022-12-01',
      wijzigingsdatum_dp: '2024-03-28T22:00:00+00:00',
      verwijderd_dp: false,
      geadopteerd_ind: false,
      locatie_id: '184575',
      type_id: '5666',
      bag_hoofdadres_verblijfsobject_id: '0363010001027867',
      gbd_buurt_id: '03630980000044',
      bag_openbareruimte_id: '0363300000004690',
      bag_nummeraanduiding_id: '0363200000516676',
      container_ral_kleur_naam: null,
      container_ral_kleur_code: null,
      container_ral_kleur_hexcode: null,
      container_chip_nummber: null,
      container_unit_card_lezer_id: null,
      container_kleur: 'NCS7000',
      container_mark: 10,
      container_datum_vervanging: '2032-02-01',
      container_datum_wijziging: '2023-12-11T23:00:00+00:00',
      container_end_of_life: null,
      container_eigenaarschap: 'Eigendom',
      container_eigenaarschap_opmerking:
        'Container is in eigendom van de klant',
      container_opmerking: null,
    },
  },
]

export const mockPublicLights: Feature[] = [
  {
    type: 'Feature',
    id: 'openbareverlichting.43',
    geometry_name: '000067',
    geometry: {
      type: 'Point',
      coordinates: [52.372935004142086, 4.901763001239158],
    },
    properties: {
      id: 43,
      object_id: '55',
      objecttype: '4',
      objecttype_omschrijving: 'LSD Objecten',
      objectnummer: '000067',
      breedtegraad: 52.3729346862489,
      lengtegraad: 4.90176284379253,
      storingstatus: 0,
      meldingstatus: 0,
    },
  },
]

export const mockCaterpillarFeatureGeo: FeaturesGeo[] = [
  {
    id: 4108613,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [52.38632248, 4.87543579],
    },
    properties: {
      species: 'Quercus robur',
      id: 4108613,
    },
  },
  {
    id: 4108614,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [52.3863225, 4.8754357],
    },
    properties: [
      {
        species: 'Quercus robur',
        id: 4108614,
      },
    ],
  },
]

export const mockCaterpillarFeature: Feature[] = [
  {
    id: 4108613,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [52.38632248, 4.87543579],
    },
    properties: {
      species: 'Quercus robur',
      id: 4108613,
      type: 'Eikenboom',
    },
  },
  {
    id: 4108614,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [52.3863225, 4.8754357],
    },
    properties: {
      species: 'Quercus robur',
      id: 4108614,
      type: 'Eikenboom',
    },
  },
]

export const mockFeaturesDenHaag: Feature[] = [
  {
    type: 'Feature',
    id: 'mast.23661',
    geometry: {
      type: 'Point',
      coordinates: [52.08410811, 4.31817273],
    },
    geometry_name: 'the_geom',
    properties: {
      LumiId: 230281,
      KastCode: 'Z508',
      MastCode: 'Koningskade-0542',
      MastNr: '0542',
      MastHoogte: '32',
      MastGroep: 'Z508-11',
      MastPlaats: '2009-12-02T23:00:00Z',
      MastMateri: '',
      UithouderT: '',
      Straat: 'Koningskade',
      MastType: 'HAAGSE MAST',
      ArmType: 'PHILIPS MONTMARTRE IJS CPO 45',
      ObjectType: 'mast',
      MastVerfSo: '',
      ArmatuurHo: '',
      MastSchild: '2023-11-15T23:00:00Z',
      MastRempla: null,
    },
  },
]
