// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { FC, SyntheticEvent } from 'react'

import type { StandardText as StandardTextType } from 'types/api/standard-texts'
import type { StatusCode } from 'types/status-code'

import ModalDialog from '../../../ModalDialog'
import {
  StyledDefaultText,
  StyledTitle,
  StyledLink,
  Wrapper,
} from '../DefaultTexts/styled'

type DefaulTextsProps = {
  standardTexts: StandardTextType[]
  status: StatusCode
  onClose: () => void
  onHandleUseStandardText: (
    event: SyntheticEvent<HTMLAnchorElement>,
    text: string
  ) => void
}

export const StandardTexts: FC<DefaulTextsProps> = ({
  standardTexts,
  status,
  onClose,
  onHandleUseStandardText,
}) => (
  <ModalDialog title="Standaardtekst" onClose={onClose}>
    <Wrapper data-scroll-lock-scrollable>
      {standardTexts.length === 0 && (
        <StyledDefaultText key={`empty_${status}`} empty>
          Er is geen standaard tekst voor deze subcategorie en status
          combinatie.
        </StyledDefaultText>
      )}

      {standardTexts.map((item, index: number) => (
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
              onHandleUseStandardText(event, item.text)
            }
          >
            Gebruik deze tekst
          </StyledLink>
        </StyledDefaultText>
      ))}
    </Wrapper>
  </ModalDialog>
)
