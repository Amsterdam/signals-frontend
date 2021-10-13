// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext } from 'react'
import styled from 'styled-components'
import { Link, themeSpacing } from '@amsterdam/asc-ui'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import AssetList from '../AssetList/AssetList'

const Wrapper = styled.div`
  position: relative;
`

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
`

const StyledAssetList = styled(AssetList)`
  margin-bottom: ${themeSpacing(1)};
`

const Summary = () => {
  const { selection, meta, edit } = useContext(AssetSelectContext)

  return (
    <Wrapper data-testid="assetSelectSummary">
      <StyledAssetList
        selection={selection}
        featureTypes={meta.featureTypes}
      ></StyledAssetList>
      <StyledLink onClick={edit} variant="inline" tabIndex={0}>
        Wijzigen
      </StyledLink>
    </Wrapper>
  )
}

export default Summary
