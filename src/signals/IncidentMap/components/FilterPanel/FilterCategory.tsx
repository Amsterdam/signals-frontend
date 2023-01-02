/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { Checkbox } from '@amsterdam/asc-ui'

import { StyledImg, CategoryItemText, CategoryItem } from './styled'

export interface Props {
  selected: boolean
  text: string
  onToggleCategory: () => void
  icon?: string
}

export const FilterCategory = ({
  selected,
  text,
  onToggleCategory,
  icon,
}: Props) => (
  <CategoryItem htmlFor={text}>
    <Checkbox
      data-testid={text}
      id={text}
      checked={selected}
      onChange={onToggleCategory}
      onKeyUp={(event) => {
        if (event.code === 'Enter') {
          onToggleCategory()
        }
      }}
    />

    <StyledImg alt={'icon ' + text} src={icon} />

    <CategoryItemText>{text}</CategoryItemText>
  </CategoryItem>
)
