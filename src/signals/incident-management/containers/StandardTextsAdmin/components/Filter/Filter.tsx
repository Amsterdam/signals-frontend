// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import Label from 'components/Label'
import RadioButtonList from 'components/RadioButtonList'
import { changeStatusOptionList } from 'signals/incident-management/definitions/statusList'

import { Form } from './styled'
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
      <Label as="span">Filter op status</Label>
      <RadioButtonList
        emptySelectionLabel="Alle statussen"
        groupName="filter-status"
        options={options}
        onChange={onStatusChange}
      />

      <Label as="span">Filter op actief/non-actief</Label>
      <RadioButtonList
        emptySelectionLabel="Alle"
        groupName="Filter-on-active"
        options={activeOption}
        onChange={onActiveChange}
      />
    </Form>
  )
}
