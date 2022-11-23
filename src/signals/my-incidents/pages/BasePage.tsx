// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC } from 'react'

import { Helmet } from 'react-helmet'
import configuration from 'shared/services/configuration/configuration'

import {
  ButtonWrapper,
  ContentWrapper,
  StyledHeading,
  StyledRow,
  StyledParagraph as Paragraph,
} from './styled'

export interface Props {
  paragraphs?: string[]
  buttons?: JSX.Element
  pageInfo: {
    documentTitle: string
    dataTestId: string
    pageTitle?: string
  }
}

export const BasePage: FC<Props> = ({
  buttons,
  children,
  pageInfo,
  paragraphs,
}) => {
  const { documentTitle, pageTitle } = pageInfo

  return (
    <StyledRow>
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
          {paragraphs?.map((paragraph, index) => (
            <Paragraph key={index}>{paragraph}</Paragraph>
          ))}

          {children}

          <ButtonWrapper>{buttons}</ButtonWrapper>
        </article>
      </ContentWrapper>
    </StyledRow>
  )
}
