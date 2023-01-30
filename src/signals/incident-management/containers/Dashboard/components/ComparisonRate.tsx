// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Description, Wrapper } from './styled'

interface Props {
  percentage: number
}

export const ComparisonRate = ({ percentage }: Props) => {
  const icon =
    percentage < 0 ? (
      <img src="/assets/images/dashboard/arrow-down.svg" alt="Arrow down" />
    ) : (
      <img src="/assets/images/dashboard/arrow-up.svg" alt="Arrow up" />
    )

  return (
    <Wrapper>
      <span>
        {icon} {percentage}%
      </span>
      <Description>vs vorige week</Description>
    </Wrapper>
  )
}
