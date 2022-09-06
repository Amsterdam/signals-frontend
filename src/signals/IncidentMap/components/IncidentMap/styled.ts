// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import styled from 'styled-components'
import Map from 'components/Map'
import { breakpoint, Button, themeSpacing } from '@amsterdam/asc-ui'

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

export const StyledButton = styled(Button)`
  position: absolute;
  top: ${themeSpacing(5)};
  left: calc(33% - ${themeSpacing(2)});
  z-index: 3;
  width: ${themeSpacing(9)};
  box-shadow: ${themeSpacing(1)} ${themeSpacing(1)} ${themeSpacing(1)}
    rgba(0, 0, 0, 0.1);
  &.hiddenPanel {
    left: 0;
  }
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    transform: rotate(-90deg);
    top: calc(50% - ${themeSpacing(3)});
    left: calc(50% - 18px);
    box-shadow: ${themeSpacing(0)} ${themeSpacing(0)} ${themeSpacing(0)}
      rgba(0, 0, 0, 0.1);
    &.hiddenPanel {
      left: calc(50% - 18px);
      top: calc(100% - ${themeSpacing(11)});
      box-shadow: ${themeSpacing(1)} ${themeSpacing(1)} ${themeSpacing(1)}
        rgba(0, 0, 0, 0.1);
    }
  }
`
