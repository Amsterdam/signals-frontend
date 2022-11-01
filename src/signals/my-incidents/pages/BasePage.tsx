// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC } from 'react'

import { default as BasePageWrapper } from 'components/pages/BasePage'

import { StyledParagraph as Paragraph, ButtonWrapper } from './styled'

interface Props {
  paragraphs?: string[]
  buttons?: JSX.Element
  pageInfo: {
    documentTitle: string
    dataTestId: string
    pageTitle: string
  }
}

export const BasePage: FC<Props> = ({
  buttons,
  children,
  pageInfo,
  paragraphs,
}) => {
  const { documentTitle, dataTestId, pageTitle } = pageInfo

  return (
    <BasePageWrapper
      documentTitle={documentTitle}
      data-testid={dataTestId}
      pageTitle={pageTitle}
    >
      {paragraphs &&
        paragraphs.map((paragraph, index) => (
          <Paragraph key={index} fontSize={16}>
            {paragraph}
          </Paragraph>
        ))}

      {children}

      <ButtonWrapper>{buttons}</ButtonWrapper>
    </BasePageWrapper>
  )
}
