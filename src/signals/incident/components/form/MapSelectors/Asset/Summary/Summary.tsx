// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { Link } from '@amsterdam/asc-ui'

import type { FC, KeyboardEvent } from 'react'

import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { formatAddress } from 'shared/services/format-address'

const Wrapper = styled.div`
  position: relative;
`

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
`

const Summary: FC = () => {
  const { address, selection, edit, meta } = useContext(AssetSelectContext)
  const { id, type } = selection || {}
  const { description } =
    meta.featureTypes.find(({ typeValue }) => typeValue === type) ?? {}

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (event?.key === 'Enter') {
        edit(event)
      }
    },
    [edit]
  )

  return (
    <Wrapper data-testid="assetSelectSummary">
      {selection && (
        <div data-testid="assetSelectSummaryDescription">{`${description} - ${id}`}</div>
      )}
      {address && (
        <div data-testid="assetSelectSummaryAddress">
          {formatAddress(address)}
        </div>
      )}
      <StyledLink
        onClick={edit}
        onKeyUp={onKeyUp}
        variant="inline"
        tabIndex={0}
      >
        Wijzigen
      </StyledLink>
    </Wrapper>
  )
}

export default Summary
