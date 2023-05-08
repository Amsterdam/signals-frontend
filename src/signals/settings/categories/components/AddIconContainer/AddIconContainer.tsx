// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { Fragment, useState } from 'react'

import { FileInput } from './FileInput'
import {
  InvisibleButton,
  StyledChevronDown,
  StyledImg,
  StyledInfo,
  StyledInstructions,
  WrapperInfo,
} from './styled'
import { StyledHeading } from '../styled'

export const AddIconContainer = () => {
  const [showSubsection, setShowSubsection] = useState<boolean>(true)

  const icon = '/assets/images/afval/rest.svg'
  return (
    <Fragment>
      <StyledHeading>Icoon</StyledHeading>
      <WrapperInfo>
        <StyledInfo>
          Het icoon wordt getoond op de openbare meldingenkaart
        </StyledInfo>

        <InvisibleButton
          title={`Toon ${showSubsection ? 'minder' : 'meer'} filter opties`}
          aria-expanded={showSubsection}
          toggle={showSubsection}
          onClick={() => {
            setShowSubsection(!showSubsection)
          }}
        >
          <StyledChevronDown />
        </InvisibleButton>
      </WrapperInfo>
      {showSubsection && (
        <>
          <StyledInstructions>
            Zorg voor een circel van 32px bij 32px en exporteer als SVG.{' '}
          </StyledInstructions>
          <StyledInstructions>Voorbeeld van een icoon:</StyledInstructions>
          <StyledImg alt={'example of an icon'} src={icon} />
        </>
      )}
      <FileInput />
    </Fragment>
  )
}
