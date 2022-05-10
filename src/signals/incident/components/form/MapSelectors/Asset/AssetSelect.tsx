// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FC } from 'react'
import { useEffect } from 'react'
import { useCallback, useState } from 'react'

import reverseGeocoderService from 'shared/services/reverse-geocoder'

import type { Incident, Location } from 'types/incident'
import type { LatLngLiteral } from 'leaflet'
import Summary from 'components/Summary'
import { useSelector } from 'react-redux'
import type { FeatureStatusType, FeatureType, Item, Meta } from '../types'

import { UNKNOWN_TYPE, UNREGISTERED_TYPE } from '../constants'
import { makeSelectIncidentContainer } from '../../../../containers/IncidentContainer/selectors'
import { AssetSelectProvider } from './context'
import Intro from './Intro'
import Selector from './Selector'

const defaultIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconUrl: '/assets/images/featureDefaultMarker.svg',
}
const defaultUnregisteredIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconUrl: '/assets/images/featureUnknownMarker.svg',
}

interface UpdatePayload {
  selection?: Item
  location?: Location
}
export interface AssetSelectProps {
  value?: {
    selection?: Item
    location?: Location
  }
  layer?: FC
  meta: Meta
  parent: {
    meta: {
      featureTypes: FeatureType[]
      featureStatusTypes: FeatureStatusType[]
      incidentContainer: { incident: Pick<Incident, 'location'> }
      updateIncident: (data: { [key: string]: any }) => void
    }
  }
}

const AssetSelect: FC<AssetSelectProps> = ({ value, layer, meta, parent }) => {
  const { selection, location } = value || {}
  const [message, setMessage] = useState<string>()
  /**
   * We should refactor reducers to use typescript, then use following types here instead of any.
   */
  const { mapActive } = useSelector(makeSelectIncidentContainer)
  const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([])
  const { coordinates, address } = location || {}
  const hasSelection = selection || coordinates

  const updateIncident = useCallback(
    (payload?: UpdatePayload) => {
      parent.meta.updateIncident({
        location: payload?.location,
        [meta.name as string]: payload,
      })
    },
    [meta.name, parent.meta]
  )

  /**
   * Selecting an object on the map
   */
  const setItem = useCallback(
    (selectedItem: Item, itemLocation?: Location) => {
      const payload = {
        selection: selectedItem,
        location: itemLocation || location,
      }

      updateIncident(payload)
    },
    [location, updateIncident]
  )

  const removeItem = useCallback(() => {
    updateIncident(undefined)
  }, [updateIncident])

  const getUpdatePayload = useCallback(
    (location: Location) => {
      // Clicking the map should unset a previous selection and preset it with an item that we know
      // doesn't exist on the map.
      const payload: UpdatePayload = { location }

      if (selection?.type === UNKNOWN_TYPE) {
        payload.selection = selection
      } else {
        payload.selection = undefined
      }

      return payload
    },
    [selection]
  )

  /**
   * Callback handler for map clicks; will fetch the address and dispatches both coordinates and
   * address to the global state.
   */
  const fetchLocation = useCallback(
    async (latLng: LatLngLiteral) => {
      const location = {
        coordinates: latLng,
        address,
      }

      const payload = getUpdatePayload(location)

      // immediately set the location so that the marker is placed on the map; the reverse geocoder response
      // might take some time to resolve, leaving the user wondering if the map click actually did anything
      updateIncident(payload)

      if (payload.location) {
        const response = await reverseGeocoderService(latLng)

        payload.location.address = response?.data?.address

        updateIncident(payload)
      }
    },
    [address, getUpdatePayload, updateIncident]
  )

  /**
   * Address auto complete selection
   */
  const setLocation = useCallback(
    (location: Location) => {
      const payload = getUpdatePayload(location)

      updateIncident(payload)
    },
    [updateIncident, getUpdatePayload]
  )

  useEffect(() => {
    if (!meta.featureTypes.length) return

    /* istanbul ignore next */ setFeatureTypes(
      meta.featureTypes.map((featureType) => {
        const defaultConfig =
          featureType.typeValue === UNREGISTERED_TYPE
            ? defaultUnregisteredIconConfig
            : defaultIconConfig

        return {
          ...featureType,
          icon: {
            ...defaultConfig,
            ...(featureType.icon || {}),
            options: {
              ...defaultConfig.options,
              ...(featureType.icon?.options || {}),
            },
          },
        }
      })
    )
  }, [meta.featureTypes])

  return (
    <AssetSelectProvider
      value={{
        address,
        coordinates,
        layer,
        message,
        meta: {
          ...meta,
          featureTypes,
        },
        removeItem,
        selection,
        setLocation,
        setItem,
        fetchLocation,
        setMessage,
      }}
    >
      {!mapActive && !hasSelection && <Intro />}
      {mapActive && 'osjdiofsjifojsdo'}
      {mapActive && <Selector />}

      {!mapActive && hasSelection && (
        <Summary
          address={address}
          coordinates={coordinates}
          selection={selection}
          featureTypes={featureTypes}
        />
      )}
    </AssetSelectProvider>
  )
}

export default AssetSelect
