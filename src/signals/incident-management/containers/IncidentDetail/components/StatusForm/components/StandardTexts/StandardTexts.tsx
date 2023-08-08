// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { SyntheticEvent } from 'react'

import ModalDialog from 'components/ModalDialog'
import type { StandardText as StandardTextType } from 'types/api/standard-texts'
import type { StatusCode } from 'types/status-code'

import {
  StyledDefaultText,
  StyledTitle,
  StyledLink,
  Wrapper,
} from '../DefaultTexts/styled'

export type Props = {
  standardTexts: StandardTextType[]
  status: StatusCode
  onClose: () => void
  onHandleUseStandardText: (
    event: SyntheticEvent<HTMLAnchorElement>,
    text: string
  ) => void
}

export const StandardTexts = ({
  standardTexts,
  status,
  onClose,
  onHandleUseStandardText,
}: Props) => (
  <ModalDialog title="Standaardtekst" onClose={onClose}>
    <Wrapper data-scroll-lock-scrollable>
      {standardTexts.length === 0 && (
        <StyledDefaultText key={`empty_${status}`} empty>
          Er is geen standaard tekst voor deze subcategorie en status
          combinatie.
        </StyledDefaultText>
      )}

      {standardTexts.map((item, index) => (
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
