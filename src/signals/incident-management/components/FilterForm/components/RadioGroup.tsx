// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FC } from 'react'

import Label from 'components/Label'
import RadioButtonList from '../../RadioButtonList'
import { FilterGroup } from '../styled'

import type { RadioButtonListProps } from '../../RadioButtonList'

type RadioGroupProps = Partial<RadioButtonListProps> & {
  label: string
  name: string
}

const RadioGroup: FC<RadioGroupProps> = ({
  defaultValue,
  onChange,
  options,
  name,
  label,
}) =>
  Array.isArray(options) && options.length > 0 ? (
    <FilterGroup data-testid={`${name}RadioGroup`}>
      <Label as="span" isGroupHeader>
        {label}
      </Label>
      <RadioButtonList
        defaultValue={defaultValue}
        groupName={name}
        onChange={onChange}
        options={options}
      />
    </FilterGroup>
  ) : null

RadioGroup.defaultProps = {
  defaultValue: '',
}

export default RadioGroup
