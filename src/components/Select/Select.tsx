// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { forwardRef } from 'react'
import type { FC, ReactNode } from 'react'

import { Select as AscSelect } from '@amsterdam/asc-ui'

import type { SubCategoryOption } from 'models/categories/selectors'

export type Option = {
  group?: string
  key: string
  name: string
  slug?: string
  value: string
}

export type Group = {
  name: string
  value: string
}

export type SelectProps = {
  emptyOption?: SubCategoryOption
  groups?: Array<Group>
  id: string
  label?: ReactNode
  name: string
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
  optionKey?: keyof SubCategoryOption
  optionName?: keyof SubCategoryOption
  options: Array<Partial<SubCategoryOption>>
  optionValue?: keyof SubCategoryOption
  value?: string
}

export type SelectOptionsProps = Pick<
  SelectProps,
  'name' | 'options' | 'optionKey' | 'optionName' | 'optionValue'
>

const SelectOptions: FC<SelectOptionsProps> = ({
  name,
  options,
  optionKey = 'key',
  optionValue = 'value',
  optionName = 'name',
}) => (
  <>
    {options.map((option) => (
      <option
        key={`${name}-${option[optionKey]}`}
        value={option[optionValue]?.toString()}
      >
        {option[optionName]}
      </option>
    ))}
  </>
)

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      onChange,
      value,
      options,
      optionKey = 'key',
      optionValue = 'value',
      optionName = 'name',
      groups,
      emptyOption,
      ...rest
    },
    ref
  ) => (
    <AscSelect
      value={value}
      onChange={onChange}
      data-testid={rest.name}
      // eslint-disable-next-line
      // @ts-ignore
      label={label}
      ref={ref}
      id={id}
      {...rest}
    >
      {emptyOption && (
        <option
          key={`${rest.name}-${emptyOption[optionKey]}`}
          value={emptyOption[optionValue]?.toString()}
        >
          {emptyOption[optionName]}
        </option>
      )}

      {groups && groups?.length > 1 ? (
        groups.map((group) => (
          <optgroup key={group.name} label={group.name}>
            <SelectOptions
              name={rest.name}
              options={options.filter((option) => option.group === group.value)}
              optionKey={optionKey}
              optionValue={optionValue}
              optionName={optionName}
            />
          </optgroup>
        ))
      ) : (
        <SelectOptions
          name={rest.name}
          options={options}
          optionKey={optionKey}
          optionValue={optionValue}
          optionName={optionName}
        />
      )}
    </AscSelect>
  )
)

export default Select
