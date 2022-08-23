// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import styled from 'styled-components'
import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'

export const IncidentMapHeaderWrapper = styled.div`
  position: relative;
  z-index: 9;
  display: flex;
  height: ${themeSpacing(20)};
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 ${themeSpacing(1)} ${themeSpacing(1)} 0 rgba(0, 0, 0, 0.1);
  @media screen and (${breakpoint('max-width', 'tabletS')}) {
    height: ${themeSpacing(14)};
  }
`
export const IncidentMapHeader = styled.div`
  background-color: ${themeColor('tint', 'level1')};
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0 ${themeSpacing(6)};
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
  padding: ${themeSpacing(5)} 0;
  @media screen and (${breakpoint('max-width', 'tabletS')}) {
    padding: ${themeSpacing(3)} 0;
  }
  margin-right: ${themeSpacing(1)};
  a {
    height: 100%;
    width: auto;

    img {
      display: flex;
      margin-right: ${themeSpacing(3)};
      height: 100%;
      max-width: 90px;
    }
  }
  h2 {
    display: inline-flex;
    margin: 0;
  }
`
