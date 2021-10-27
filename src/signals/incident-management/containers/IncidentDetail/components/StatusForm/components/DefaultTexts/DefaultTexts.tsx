// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { Fragment } from 'react'
import styled, { css } from 'styled-components'
import { Link, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'

import type { FC, SyntheticEvent } from 'react'
import type { DefaultText as DefaultTextType } from 'types/api/default-text'
import { StatusCode } from 'signals/incident-management/definitions/types'

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
`

const StyledDefaultText = styled.div<{ empty?: boolean }>`
  background-color: ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(1)};

  ${({ empty }) =>
    empty &&
    css`
      color: ${themeColor('tint', 'level5')};
    `}
`

const StyledTitle = styled.div`
  font-family: 'Avenir Next LT W01 Demi';
  margin-bottom: ${themeSpacing(2)};
`

const StyledLink = styled(Link)`
  font-size: ${themeSpacing(4)};
  margin-top: ${themeSpacing(2)};
  text-decoration: underline;
  display: inline-block;
  cursor: pointer;
`

export type DefaulTextsProps = {
  defaultTexts: Array<DefaultTextType>
  status: StatusCode
  onHandleUseDefaultText: (
    event: SyntheticEvent<HTMLAnchorElement>,
    text: string
  ) => void
}

const DefaultTexts: FC<DefaulTextsProps> = ({
  defaultTexts,
  status,
  onHandleUseDefaultText,
}) => {
  const allText =
    defaultTexts?.length > 0 &&
    defaultTexts.find((text) => text.state === status)

  return (
    <Fragment>
      <StyledH4 forwardedAs="h4" data-testid="defaultTextsTitle">
        Standaard teksten
      </StyledH4>

      {(!allText || allText.templates.length === 0) && (
        <StyledDefaultText key={`empty_${status}`} empty>
          Er is geen standaard tekst voor deze subcategorie en status
          combinatie.
        </StyledDefaultText>
      )}

      {allText &&
        allText.templates.map((item, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <StyledDefaultText key={`${index}${status}${JSON.stringify(item)}`}>
            <StyledTitle data-testid="defaultTextsItemTitle">
              {item.title}
            </StyledTitle>
            <div data-testid="defaultTextsItemText">{item.text}</div>
            <StyledLink
              data-testid="defaultTextsItemButton"
              variant="inline"
              onClick={(event: SyntheticEvent<HTMLAnchorElement>) =>
                onHandleUseDefaultText(event, item.text)
              }
            >
              Gebruik deze tekst
            </StyledLink>
          </StyledDefaultText>
        ))}
    </Fragment>
  )
}

export default DefaultTexts
