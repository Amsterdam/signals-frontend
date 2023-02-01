// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Description, ComparisonRateWrapper as Wrapper } from './styled'

interface Props {
  percentage: number
}

export const ComparisonRate = ({ percentage }: Props) => {
  const direction = percentage < 0 ? 'down' : 'up'

  return (
    <Wrapper>
      <span>
        {
          <img
            src={`/assets/images/dashboard/arrow-${direction}.svg`}
            alt={`Arrow ${direction}`}
          />
        }{' '}
        {percentage}%
      </span>
      <Description>vs vorige week</Description>
    </Wrapper>
  )
}
