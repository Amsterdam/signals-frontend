// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect, useRef, useState } from 'react'

import { Close } from '@amsterdam/asc-assets'
import { Heading } from '@amsterdam/asc-ui'
import format from 'date-fns/format'
import nl from 'date-fns/locale/nl'
import { capitalize } from 'shared/services/date-utils'
import type { PdokAddress } from 'shared/services/map-location'
import styled from 'styled-components'

import type { Incident } from '../../types'
import { StyledList } from './styled'
import { CloseButton, DetailsWrapper } from './styled'
import { getAddress } from './utils'

// Using this block, we can use ref on DetailsWrapper
const Block = styled.div``

const defaultAddress: PdokAddress = {
  openbare_ruimte: 'Onbekend',
  huisnummer: '',
  postcode: '',
  woonplaats: '',
}

export interface Props {
  onClose: () => void
  incident: Incident
}

export const DetailPanel = ({ onClose, incident }: Props) => {
  const [address, setAddress] = useState<PdokAddress>(defaultAddress)

  const detailWrapperRef = useRef<HTMLElement>()

  const { properties, geometry } = incident
  const date = new Date(properties.created_at)

  useEffect(() => {
    setAddress(defaultAddress)
  }, [incident])

  useEffect(() => {
    getAddress(geometry, setAddress)
  }, [geometry, incident])

  useEffect(() => {
    const button = detailWrapperRef.current?.querySelector(
      'button[title="Sluiten"]'
    ) as HTMLElement
    button.focus()
  }, [])

  return (
    <Block as={DetailsWrapper} ref={detailWrapperRef}>
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
        <dd>{capitalize(format(date, 'd MMMM yyyy', { locale: nl }))}</dd>

        <dt>Adres dichtbij</dt>
        <dd>
          {address.openbare_ruimte} {address.huisnummer}
        </dd>
        <dd>
          {address.postcode} {address.woonplaats}
        </dd>
      </StyledList>
    </Block>
  )
}
