// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { FC, SyntheticEvent } from 'react'
import type { DefaultText as DefaultTextType } from 'types/api/default-text'
import type { StatusCode } from 'signals/incident-management/definitions/types'

import { StyledH4, StyledDefaultText, StyledTitle, StyledLink } from './styled'

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
    <>
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
    </>
  )
}

export default DefaultTexts
