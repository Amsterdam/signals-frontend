// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext } from 'react'
import styled from 'styled-components'
import { Link, themeSpacing } from '@amsterdam/asc-ui'
import SelectionList from '../SelectionList'
import SelectContext from '../context/context'

const Wrapper = styled.div`
  position: relative;
`

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
`

const StyledSelectionList = styled(SelectionList)`
  margin-bottom: ${themeSpacing(1)};
`

const Summary = () => {
  const {
    selection,
    edit,
    meta: { featureTypes, icons },
  } = useContext(SelectContext)

  return (
    <Wrapper data-testid="caterpillarSelectSummary">
      <StyledSelectionList
        selection={selection}
        icons={icons}
        featureTypes={featureTypes}
      ></StyledSelectionList>
      <StyledLink onClick={edit} variant="inline" tabIndex={0}>
        Wijzigen
      </StyledLink>
    </Wrapper>
  )
}

export default Summary
