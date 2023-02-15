// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Description, ComparisonRateWrapper as Wrapper } from './styled'
import type { ComparisonRateType } from './types'

export interface Props {
  comparisonRate: ComparisonRateType
}

export const ComparisonRate = ({ comparisonRate }: Props) => (
  <Wrapper>
    <span>
      {
        <img
          src={`/assets/images/dashboard/arrow-${comparisonRate.direction}.svg`}
          alt={`Arrow ${comparisonRate.direction}`}
        />
      }{' '}
      {comparisonRate.percentage}%
    </span>
    <Description>vs vorige week</Description>
  </Wrapper>
)
