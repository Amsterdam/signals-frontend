// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FC } from 'react'

import { Accordion } from 'components/Accordion'
import CheckboxList from 'components/CheckboxList'
import type { CheckboxListProps } from 'components/CheckboxList'
import Label from 'components/Label'

import type { FilterState, Options } from '../reducer'
import { FilterGroup } from '../styled'

const renderId = 0

type CheckboxGroupProps = Partial<CheckboxListProps> & {
  label: string
  name: keyof Options
  state?: FilterState
  hasAccordion?: boolean
}

const getCount = (name: keyof Options, state?: FilterState) =>
  state?.options[name]?.length ?? ''

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  defaultValue = [],
  hasToggle = true,
  hasAccordion = false,
  label,
  name,
  onChange,
  onSubmit,
  onToggle,
  options,
  state,
}) => {
  if (!options || options?.length === 0) {
    return null
  }

  const CheckboxGroupContent = (
    <FilterGroup
      data-testid={`${name}-checkbox-group`}
      data-render-id={renderId + 1}
    >
      <CheckboxList
        defaultValue={defaultValue}
        hasToggle={hasToggle}
        name={name}
        onChange={onChange}
        onSubmit={onSubmit}
        onToggle={onToggle}
        options={options}
        id={name}
        title={
          !hasAccordion && (
            <Label as="span" isGroupHeader>
              {label}
            </Label>
          )
        }
      />
    </FilterGroup>
  )

  if (hasAccordion) {
    return (
      <Accordion count={getCount(name, state)} id={name} title={label}>
        {CheckboxGroupContent}
      </Accordion>
    )
  }

  return CheckboxGroupContent
}
