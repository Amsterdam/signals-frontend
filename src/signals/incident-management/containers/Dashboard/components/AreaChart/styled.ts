// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const AreaChartWrapper = styled.div`
  position: relative;
`

export const ComparisonRateWrapper = styled.span`
  position: absolute;
  display: flex;
  flex-direction: column;
  color: ${themeColor('primary')};
  right: 50px;
  bottom: 60px;
  font-size: ${themeSpacing(3.5)};
  line-height: ${themeSpacing(4)};
  font-weight: 700;
  text-align: right;
`

export const Description = styled.span`
  font-size: ${themeSpacing(1.75)};
  line-height: ${themeSpacing(2)};
`
