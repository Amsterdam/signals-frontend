// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Description, Wrapper } from './styled'

const getPercentage = () => {
  return 10
}

export const ComparisonRate = () => {
  const percentage = getPercentage()

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
