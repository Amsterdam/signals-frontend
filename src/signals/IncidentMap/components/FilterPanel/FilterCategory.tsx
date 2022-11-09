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
    />
<<<<<<< HEAD

    <StyledImg alt={'icon ' + text} src={icon} />

=======
    <StyledImg alt="icon" src={icon} />
>>>>>>> ad00446b9 (resize filter icons and set default icons (#2364))
    <CategoryItemText>{text}</CategoryItemText>
  </CategoryItem>
)
