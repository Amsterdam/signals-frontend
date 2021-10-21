// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, useState } from 'react'

import type { UseFormMethods } from 'react-hook-form'
import type { FC } from 'react'
import type { Group } from 'components/Select'
import type { SubCategoryOption } from 'models/categories/selectors'
import Select from 'components/Select'

import { StyledInfoText, StyledSelect } from '../../styled'

interface IncidentSplitSelectInputProps
  extends Partial<Pick<UseFormMethods, 'register'>> {
  id: string
  display: string
  initialValue: string
  name: string
  options: Array<SubCategoryOption>
  groups?: Array<Group>
}

const getSelectedOption = (options: Array<SubCategoryOption>, value: string) =>
  options.find((item) => item.key === value)

const IncidentSplitSelectInput: FC<IncidentSplitSelectInputProps> = ({
  id,
  name,
  display,
  options,
  groups,
  initialValue,
  register,
}) => {
  const [selected, setSelected] = useState(
    getSelectedOption(options, initialValue)
  )

  const onChange = useCallback(
    (event) => {
      event.preventDefault()
      setSelected(getSelectedOption(options, event.target.value))
    },
    [options]
  )

  return (
    <StyledSelect>
      <Select
        id={name}
        label={<strong>{display}</strong>}
        name={name}
        ref={register}
        data-testid={`${id}`}
        onChange={onChange}
        value={selected?.key}
        optionValue="key"
        options={options}
        groups={groups}
      />

      {selected?.description && <StyledInfoText text={selected.description} />}
    </StyledSelect>
  )
}

export default IncidentSplitSelectInput
