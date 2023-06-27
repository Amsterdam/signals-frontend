// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import type { FC, SyntheticEvent } from 'react'

import type { DefaultText as DefaultTextType } from 'types/api/default-text'
import type { StatusCode } from 'types/status-code'

import { StyledDefaultText, StyledTitle, StyledLink, Wrapper } from './styled'
import ModalDialog from '../../../ModalDialog'

export type DefaulTextsProps = {
  defaultTexts: Array<DefaultTextType>
  status: StatusCode
  onClose: () => void
  onHandleUseDefaultText: (
    event: SyntheticEvent<HTMLAnchorElement>,
    text: string
  ) => void
}

const DefaultTexts: FC<DefaulTextsProps> = ({
  defaultTexts,
  status,
  onClose,
  onHandleUseDefaultText,
}) => {
  const allText =
    defaultTexts?.length > 0 &&
    defaultTexts.find((text) => text.state === status)

  return (
    <ModalDialog title="Standaardtekst" onClose={onClose}>
      <Wrapper data-scroll-lock-scrollable>
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
              <StyledTitle data-testid="default-texts-item-title">
                {item.title}
              </StyledTitle>
              <div data-testid="default-texts-item-text">{item.text}</div>
              <StyledLink
                data-testid="default-texts-item-button"
                variant="inline"
                onClick={(event: SyntheticEvent<HTMLAnchorElement>) =>
                  onHandleUseDefaultText(event, item.text)
                }
              >
                Gebruik deze tekst
              </StyledLink>
            </StyledDefaultText>
          ))}
      </Wrapper>
    </ModalDialog>
  )
}

export default DefaultTexts
