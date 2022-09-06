// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import styled from 'styled-components'
import Map from 'components/Map'
import { breakpoint } from '@amsterdam/asc-ui'

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  display: flex;
`

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  height: 100%;
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    flex-direction: column;
  }
`

export const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
  z-index: 0;
`
