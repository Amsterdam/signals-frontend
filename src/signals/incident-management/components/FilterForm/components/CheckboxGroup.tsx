// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { FC } from 'react'

import Label from 'components/Label'
import CheckboxList from '../../CheckboxList'
import { FilterGroup } from '../styled'

import type { CheckboxListProps } from '../../CheckboxList'

const renderId = 0

type CheckboxGroupProps = Partial<CheckboxListProps> & {
  label: string
  name: string
}

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  defaultValue,
  hasToggle,
  label,
  name,
  onChange,
  onSubmit,
  onToggle,
  options,
}) =>
  Array.isArray(options) && options.length > 0 ? (
    <FilterGroup
      data-testid={`${name}CheckboxGroup`}
      data-render-id={renderId + 1}
    >
      <CheckboxList
        defaultValue={defaultValue}
        hasToggle={hasToggle}
        name={name}
        onChange={onChange}
        onToggle={onToggle}
        onSubmit={onSubmit}
        options={options}
        title={
          <Label as="span" isGroupHeader>
            {label}
          </Label>
        }
      />
    </FilterGroup>
  ) : null

CheckboxGroup.defaultProps = {
  defaultValue: [],
  hasToggle: true,
}
