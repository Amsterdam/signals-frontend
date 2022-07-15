// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import styled from 'styled-components'
import { MenuButton, themeColor, themeSpacing } from '@amsterdam/asc-ui'

export const IncidentMapHeaderWrapper = styled.div`
  display: flex;
  height: ${themeSpacing(16)};
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  border-bottom: ${themeSpacing(1)} solid ${themeColor('tint', 'level3')};
`
export const IncidentMapHeader = styled.div`
  background-color: ${themeColor('tint', 'level1')};
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  padding: 0 ${themeSpacing(3)};
  width: 100%;
  height: 100%;
`

export const Title = styled.div`
  display: flex;
  align-items: 'center;
`

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  margin-right: ${themeSpacing(1)};
  a {
    height: 100%;
    width: auto;
    img {
      display: inline-block;
      margin-right: ${themeSpacing(3)};
      height: 100%;
      width: auto;
    }
  }
`

export const IncidentMapMenuButton = styled(MenuButton)`
  @media screen and (max-width: 576px) {
    display: none;
  }
`
