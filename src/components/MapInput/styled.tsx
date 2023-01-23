// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { ViewerContainer } from '@amsterdam/arm-core'
import styled from 'styled-components'

import Map from '../Map'
import PDOKAutoSuggest from '../PDOKAutoSuggest'

export const Wrapper = styled.div`
  position: relative;
`

export const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
  text-align: center;
`

export const StyledViewerContainer = styled(ViewerContainer)`
  position: unset;
  & > * {
    width: calc(
      100% - 8px
    ); // Subtract 8px to prevent horizontal scroll bar on MacOS (Firefox/Safari).
  }
`

export const StyledAutosuggest = styled(PDOKAutoSuggest)`
  position: absolute;
  left: 0;
  width: 40%;
  max-width: calc(100% - 32px);
  z-index: 401; // 400 is the minimum elevation where elements are shown above the map

  @media (max-width: ${({ theme }) => theme.layouts.large.max}px) {
    width: 60%;
  }

  @media (max-width: ${({ theme }) => theme.layouts.medium.max}px) {
    width: 100%;
  }
`
