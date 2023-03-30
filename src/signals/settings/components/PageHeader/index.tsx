// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { Heading, Row, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

const StyledSection = styled.section<{ hasBackLink: boolean }>`
  contain: content;
  padding-top: ${themeSpacing(6)};
  padding-bottom: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(5)};

  ${({ hasBackLink }) =>
    hasBackLink &&
    css`
      h1 {
        margin-top: ${themeSpacing(3)};
      }
    `}
`

const StyledHeading = styled(Heading)`
  margin: 0;
  line-height: 44px;
`

const StyledHeadingWrapper = styled.div`
  flex-basis: 100%;
`

type Props = {
  title: string
  children?: ReactNode
  BackLink?: string
  filter?: {
    name: string
    options: any
  }
  className?: string
  subHeading?: string
}

const PageHeader = ({ BackLink, className, children, title }: Props) => (
  <StyledSection
    data-testid="settings-page-header"
    className={className}
    hasBackLink={Boolean(BackLink)}
  >
    <Row>
      <StyledHeadingWrapper>
        {BackLink}
        <StyledHeading>{title}</StyledHeading>
      </StyledHeadingWrapper>
      {children}
    </Row>
  </StyledSection>
)

export default PageHeader
