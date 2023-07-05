// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import Label from 'components/Label'
import RadioButtonList from 'components/RadioButtonList'
import type { RadioButtonOption } from 'components/RadioButtonList'
import { changeStatusOptionList } from 'signals/incident-management/definitions/statusList'

import { Form } from './styled'

const statusOptions = changeStatusOptionList.map((option) => ({
  key: option.key,
  value: option.value,
}))

const activeOptions = [
  {
    key: 'true',
    value: 'Actief',
  },
  {
    key: 'false',
    value: 'Non-actief',
  },
]

export interface Props {
  setActiveFilter: (active: RadioButtonOption) => void
  setStatusFilter: (filter: RadioButtonOption) => void
  currentStatusFilter: any
  currentActiveFilter: any
}

export const Filter = ({
  setStatusFilter,
  setActiveFilter,
  currentStatusFilter,
  currentActiveFilter,
}: Props) => {
  const onStatusChange = (_groupName: string, option: RadioButtonOption) => {
    setStatusFilter(option)
  }

  const onActiveChange = (_groupName: string, option: RadioButtonOption) => {
    setActiveFilter(option)
  }

  return (
    <Form>
      <Label as="span">Filter op status</Label>
      <RadioButtonList
        emptySelectionLabel="Alle statussen"
        groupName="filter-status"
        options={statusOptions}
        onChange={onStatusChange}
        defaultValue={currentStatusFilter?.key}
      />

      <Label as="span">Filter op actief/non-actief</Label>
      <RadioButtonList
        emptySelectionLabel="Alle"
        groupName="filter-on-active"
        options={activeOptions}
        onChange={onActiveChange}
        defaultValue={currentActiveFilter?.key}
      />
    </Form>
  )
}
