// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import type { FC } from 'react'

import { Helmet } from 'react-helmet'

import configuration from 'shared/services/configuration/configuration'

import {
  ButtonWrapper,
  ContentWrapper,
  StyledHeading,
  StyledRow,
  StyledParagraph as Paragraph,
  StyledErrorAlert,
} from './styled'

export interface Props {
  pageInfo: {
    documentTitle: string
    dataTestId: string
    pageTitle?: string
  }
  errorMessage?: string
  paragraphs?: string[]
  buttons?: JSX.Element
}

export const BasePage: FC<Props> = ({
  buttons,
  children,
  pageInfo,
  paragraphs,
  errorMessage,
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
          {errorMessage && <StyledErrorAlert>{errorMessage}</StyledErrorAlert>}
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
