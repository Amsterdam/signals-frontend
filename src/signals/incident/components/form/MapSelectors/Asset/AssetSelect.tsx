// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FC } from 'react'
import { useEffect } from 'react'
import { useCallback, useState } from 'react'

import type { FeatureCollection } from 'geojson'
import type { LatLngLiteral } from 'leaflet'
import { useDispatch, useSelector } from 'react-redux'

import Summary from 'components/Summary'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { updateIncident as updateReduxIncident } from 'signals/incident/containers/IncidentContainer/actions'
import { makeSelectIncidentContainer } from 'signals/incident/containers/IncidentContainer/selectors'
import type { Incident, Location } from 'types/incident'

import { AssetSelectProvider } from './context'
import Intro from './Intro'
import Selector from './Selector'
import SelectorV2 from './Selector_v2_removeafterfinishepic5440'
import configuration from '../../../../../../shared/services/configuration/configuration'
import { UNKNOWN_TYPE, UNREGISTERED_TYPE } from '../constants'
import type { FeatureStatusType, FeatureType, Item, Meta } from '../types'

const defaultIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconUrl: '/assets/images/feature-default-marker.svg',
}
const defaultUnregisteredIconConfig: FeatureType['icon'] = {
  options: {
    className: 'object-marker',
    iconSize: [40, 40],
  },
  iconUrl: '/assets/images/feature-unknown-marker.svg',
}

interface UpdatePayload {
  selection?: Item[]
  location?: Location
}
export interface AssetSelectProps {
  value?: {
    selection?: Item[]
    location?: Location
  }
  layer?: FC
  meta: Meta
  parent: {
    meta: {
      featureTypes: FeatureType[]
      featureStatusTypes: FeatureStatusType[]
      incidentContainer: { incident: Pick<Incident, 'location'> }
      maxNumberOfObjects?: number
      updateIncident: (data: { [key: string]: any }) => void
      addToSelection: (data: { [key: string]: any }) => void
      removeFromSelection: (data: { [key: string]: any }) => void
    }
  }
}

const AssetSelect: FC<AssetSelectProps> = ({ value, layer, meta, parent }) => {
  const dispatch = useDispatch()
  const { selection, location } = value || {}
  const [message, setMessage] = useState<string>()
  const [addressLoading, setAddressLoading] = useState(false)
  const [selectableFeatures, setSelectableFeatures] = useState<
    FeatureCollection | undefined
  >(undefined)
  const { mapActive } = useSelector(makeSelectIncidentContainer)
  const [featureTypes, setFeatureTypes] = useState<FeatureType[]>([])
  const { coordinates, address } = location || {}
  const hasSelection = selection || coordinates
  const { maxNumberOfAssets } = meta
  const updateIncident = useCallback(
    (payload?: UpdatePayload) => {
      parent.meta.updateIncident({
        location: payload?.location,
        [meta.name as string]: payload,
        meta_name: meta.name,
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
        selection: [selectedItem],
        location: itemLocation || location,
        maxNumberOfAssets: maxNumberOfAssets || 1,
      }
      parent.meta.addToSelection({
        location: payload.location,
        [meta.name as string]: payload,
        meta_name: meta.name,
      })
    },
    [location, meta.name, parent.meta, maxNumberOfAssets]
  )

  const removeItem = (selectedItem?: Item) => {
    const payload = {
      selection: selectedItem ? [selectedItem] : undefined,
    }

    dispatch(updateReduxIncident({ maxAssetWarning: false }))
    parent.meta.removeFromSelection({
      [meta.name as string]: payload,
      meta_name: meta.name,
    })
  }

  const getUpdatePayload = useCallback(
    (location: Location) => {
      // Clicking the map should unset a previous selection and preset it with an item that we know
      // doesn't exist on the map.
      const payload: UpdatePayload = { location, selection }

      const item = selection ? selection[0] : undefined

      if (item?.type === UNKNOWN_TYPE) {
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
        setAddressLoading(true)
        const response = await reverseGeocoderService(latLng)
        payload.location.address = response?.data?.address
        updateIncident(payload)
        setAddressLoading(false)
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
        selectableFeatures,
        addressLoading,
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
        setSelectableFeatures,
        setAddressLoading,
      }}
    >
      {!mapActive && !hasSelection && <Intro />}

      {configuration.featureFlags.showSelectorV2removeafterfinishepic5440
        ? mapActive && <SelectorV2 />
        : mapActive && <Selector />}

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
