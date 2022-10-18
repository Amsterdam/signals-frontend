/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { Checkbox } from '@amsterdam/asc-ui'

import { StyledImg, LegendText, LegendItem } from './styled'

export interface Props {
  selected: boolean
  text: string
  onToggleCategory: (select: boolean) => void
  icon?: string
}

export const FilterCategory = ({
  selected,
  text,
  onToggleCategory,
  icon,
}: Props) => {
  return (
    <LegendItem htmlFor={text}>
      <Checkbox
        data-testid={text}
        id={text}
        checked={selected}
        onChange={() => {
          onToggleCategory(!selected)
        }}
      />
      <StyledImg
        alt="icon"
        src={icon || 'assets/images/icon-incident-marker.svg'}
      />
      <LegendText>{text}</LegendText>
    </LegendItem>
  )
}
