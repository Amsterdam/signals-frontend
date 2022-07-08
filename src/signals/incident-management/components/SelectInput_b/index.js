// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import styled from 'styled-components'
import Select from 'components/Select'

const Wrapper = styled.div`
  width: 100%;
`

export const SelectInput = ({
  name: inputName,
  display,
  values,
  groups,
  emptyOption,
  onChange,
  value: current,
}) => {
  const options = values.map(({ key, value, group }) => ({
    key: key || '',
    name: value,
    value: key || '',
    group,
  }))

  return (
    <Wrapper>
      <Select
        value={current}
        id={inputName}
        label={<strong>{display}</strong>}
        name={inputName}
        options={options}
        groups={groups}
        emptyOption={emptyOption}
        onChange={onChange}
      />
    </Wrapper>
  )
}

export default SelectInput
