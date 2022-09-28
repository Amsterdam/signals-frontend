// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { Close } from '@amsterdam/asc-assets'
import { Heading } from '@amsterdam/asc-ui'

import { string2date, string2time } from 'shared/services/string-parser'

import type { Incident } from '../../types'
import { StyledList } from './styled'
import { CloseButton, DetailsWrapper } from './styled'
import type { DisplayAddress } from './types'
import { getAddress } from './utils'

const defaultAddress: DisplayAddress = {
  streetName: 'Onbekend',
  postalCode: '',
}

export interface Props {
  onClose: () => void
  incident: Incident
}

export const DetailPanel = ({ onClose, incident }: Props) => {
  const { properties, geometry } = incident
  const [address, setAddress] = useState(defaultAddress)

  useEffect(() => {
    setAddress(defaultAddress)
  }, [])

  useEffect(() => {
    getAddress(geometry, setAddress)
  }, [geometry, incident])

  return (
    <DetailsWrapper>
      <CloseButton
        type="button"
        variant="blank"
        title="Sluiten"
        aria-label="Detail panel sluiten"
        iconSize={20}
        onClick={onClose}
        iconLeft={<Close />}
      />

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
    </DetailsWrapper>
  )
}
