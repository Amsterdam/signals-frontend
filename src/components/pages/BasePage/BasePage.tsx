// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { Heading, Row, themeSpacing } from '@amsterdam/asc-ui'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import configuration from 'shared/services/configuration/configuration'

const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(5)} 0;
`

export const DEFAULT_MESSAGE = 'Pagina niet gevonden'

interface BasePageProps {
  documentTitle?: string
  pageTitle?: string
  body?: string
  children?: ReactNode
}

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: ${themeSpacing(8)};

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    grid-template-columns: 8fr 4fr;
    grid-column-gap: ${themeSpacing(5)};
  }
`

const BasePage = ({
  documentTitle,
  pageTitle,
  children,
  ...props
}: BasePageProps) => (
  <Row data-testid="base-page" {...props}>
    <ContentWrapper>
      <Helmet
        defaultTitle={configuration.language.siteTitle}
        titleTemplate={`${configuration.language.siteTitle} - %s`}
      >
        {documentTitle && <title>{documentTitle}</title>}
      </Helmet>

      <article>
        {pageTitle && (
          <header>
            <StyledHeading>{pageTitle}</StyledHeading>
          </header>
        )}

        {children}
      </article>
    </ContentWrapper>
  </Row>
)

export default BasePage
