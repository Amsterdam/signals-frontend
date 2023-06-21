// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { changeStatusOptionList } from 'signals/incident-management/definitions/statusList'

import { Form } from './styled'
import { RadioGroup } from '../../../../components/FilterForm/components/RadioGroup'
interface Props {
  setStatusFilter: (filter: any) => void
  setActiveFilter: (active: any) => void
}

const activeOption = [
  {
    key: 'true',
    value: 'Actief',
  },
  {
    key: 'false',
    value: 'Non-actief',
  },
]

export const Filter = ({ setStatusFilter, setActiveFilter }: Props) => {
  const options = changeStatusOptionList.map((option) => ({
    key: option.key,
    value: option.value,
  }))

  const onStatusChange = (_groupName: any, option: any) => {
    setStatusFilter(option)
  }

  const onActiveChange = (_groupName: any, option: any) => {
    setActiveFilter(option)
  }

  return (
    <Form>
      <RadioGroup
        label="Filter op status"
        name="status-filter"
        options={options}
        onChange={onStatusChange}
      />

      <RadioGroup
        label="Filter op actief/non-actief"
        name="is-actief-filter"
        options={activeOption}
        onChange={onActiveChange}
      />
    </Form>
  )
}
