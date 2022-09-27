// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { Heading } from '@amsterdam/asc-ui'

import { formatAddress } from 'shared/services/format-address'
import { featureToCoordinates } from 'shared/services/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { string2date, string2time } from 'shared/services/string-parser'

import type { Incident, Point } from '../../types'
import { StyledList } from './styled'

interface Props {
  incident: Incident
}

interface DisplayAddress {
  streetName: string
  postalCode: string
}

const defaultAddress: DisplayAddress = {
  streetName: 'Onbekend',
  postalCode: '',
}

const getAddress = async (
  geometry: Point,
  setAddress: (address: DisplayAddress) => void
) => {
  const coordinates = featureToCoordinates(geometry)
  const response = await reverseGeocoderService(coordinates)

  if (response) {
    const formattedAddres = formatAddress(response.data.address).split(',')

    setAddress({
      streetName: formattedAddres[0],
      postalCode: formattedAddres[1],
    })
  }
}

export const DetailContent = ({ incident }: Props) => {
  const { properties, geometry } = incident
  const [address, setAddress] = useState(defaultAddress)

  useEffect(() => {
    setAddress(defaultAddress)
  }, [])

  useEffect(() => {
    getAddress(geometry, setAddress)
  }, [geometry, incident])

  return (
    <StyledList>
      <dt>Melding</dt>
      <Heading forwardedAs="h2">{properties.category.name}</Heading>

      <dt>Datum melding</dt>
      <dd>
        {' '}
        {string2date(properties.created_at)}{' '}
        {string2time(properties.created_at)}
      </dd>

      <dt>Adres dichtbij</dt>
      <dd>{address.streetName}</dd>
      <dd>{address.postalCode}</dd>
    </StyledList>
  )
}
