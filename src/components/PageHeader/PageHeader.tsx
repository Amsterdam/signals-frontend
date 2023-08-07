// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'

import type { RadioButtonOption } from 'components/RadioButtonList'

import { StyledSection, StyledHeadingWrapper, StyledHeading } from './styled'

type Props = {
  title: string
  children?: ReactNode
  BackLink?: ReactNode
  filter?: {
    name: string
    options: RadioButtonOption[]
  }
  className?: string
  subHeading?: string
  dataTestId?: string
}

export const PageHeader = ({
  BackLink,
  className,
  children,
  title,
  dataTestId = `${title}-page-header`,
}: Props) => (
  <StyledSection
    data-testid={dataTestId}
    className={className}
    hasBackLink={Boolean(BackLink)}
  >
    <StyledHeadingWrapper>
      {BackLink}
      <StyledHeading>{title}</StyledHeading>
    </StyledHeadingWrapper>
    {children}
  </StyledSection>
)
