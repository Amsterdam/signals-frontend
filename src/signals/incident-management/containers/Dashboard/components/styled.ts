// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Title = styled.h6`
  font-size: ${themeSpacing(4.5)};
  line-height: ${themeSpacing(8)};
  color: ${themeColor('tint', 'level7')};
  margin-bottom: 0;
`

export const Subtitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  line-height: ${themeSpacing(6)};
  margin-top: 0;
  margin-bottom: ${themeSpacing(5)};
`

export const Amount = styled.span`
  color: ${themeColor('primary')};
`

export const AreaChartWrapper = styled.span`
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
