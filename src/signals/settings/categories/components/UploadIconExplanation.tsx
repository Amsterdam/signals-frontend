// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { Fragment, useCallback, useState } from 'react'

import {
  InvisibleButton,
  StyledHeading,
  StyledImg,
  StyledInfo,
  StyledInstructions,
  WrapperInfo,
} from './styled'

export const UploadIconExplanation = () => {
  const [showSubsection, setShowSubsection] = useState<boolean>(false)

  const handleClick = useCallback(
    (event) => {
      event.preventDefault()
      setShowSubsection(!showSubsection)
    },
    [showSubsection]
  )

  const icon = '/assets/images/afval/rest.svg'
  const iconChevronDownBlue = '/assets/images/chevron-down-blue.svg'
  return (
    <Fragment>
      <StyledHeading>Icoon</StyledHeading>
      <WrapperInfo>
        <StyledInfo>
          Het icoon wordt getoond op de openbare meldingenkaart.
        </StyledInfo>

        <InvisibleButton
          title="Toon upload uitleg"
          data-testid="chevron-down-show-explanation"
          aria-expanded={showSubsection}
          toggle={showSubsection}
          onClick={handleClick}
        >
          <StyledImg alt={'icon chevrondown blue'} src={iconChevronDownBlue} />
        </InvisibleButton>
      </WrapperInfo>
      {showSubsection && (
        <>
          <StyledInstructions>
            Zorg voor een circel van 32px bij 32px en exporteer als SVG.
          </StyledInstructions>
          <StyledInstructions>Voorbeeld van een icoon:</StyledInstructions>
          <StyledImg alt={'example of an icon'} src={icon} />
        </>
      )}
    </Fragment>
  )
}
