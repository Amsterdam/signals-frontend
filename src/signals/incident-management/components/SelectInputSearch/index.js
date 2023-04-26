// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import styled from 'styled-components'

import { SelectSearch } from 'components/SelectSearch/SelectSearch'

const Wrapper = styled.div`
  width: 100%;
`

export const SelectInputSearch = ({
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
      <SelectSearch
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

export default SelectInputSearch
