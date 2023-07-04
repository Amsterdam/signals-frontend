// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'

import type { Option } from 'components/Select/Select'

import { StyledHeading, StyledHeadingWrapper, StyledSection } from './styled'

type Props = {
  title: string
  children?: ReactNode
  backLink?: ReactNode
  filter?: {
    name: string
    options: Option[]
  }
  className?: string
  subHeading?: string
}

export const PageHeader = ({ backLink, className, children, title }: Props) => (
  <StyledSection
    data-testid="defaulttextadmin-page-header"
    className={className}
    hasBackLink={Boolean(backLink)}
  >
    <StyledHeadingWrapper>
      {backLink}
      <StyledHeading>{title}</StyledHeading>
    </StyledHeadingWrapper>
    {children}
  </StyledSection>
)
