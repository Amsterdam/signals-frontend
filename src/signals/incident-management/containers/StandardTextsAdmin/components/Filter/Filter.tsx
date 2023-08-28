// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import Label from 'components/Label'
import RadioButtonList from 'components/RadioButtonList'
import type { RadioButtonOption } from 'components/RadioButtonList/types'
import { changeStatusOptionList } from 'signals/incident-management/definitions/statusList'

import { Form } from './styled'
import type {
  Option,
  StandardTextsAdminValue,
  StandardTextsData,
  Facet,
} from '../../types'

const getStatusOptions = (options: RadioButtonOption[], meta?: Facet[]) => {
  return options.map((option) => {
    const optionMeta = meta?.find((data) => data.term === option.key)

    const count = optionMeta?.count ? { count: optionMeta?.count } : {}

    return {
      key: option.key,
      value: option.value,
      ...count,
    }
  })
}

const getActiveOptions = (meta?: Facet[]) => {
  return [
    {
      key: 'true',
      value: 'Actief',
    },
    {
      key: 'false',
      value: 'Non-actief',
    },
  ].map((option) => {
    const optionMeta = meta?.find((data) => data.term.toString() === option.key)
    const count = optionMeta?.count ? { count: optionMeta?.count } : {}

    return {
      ...option,
      ...count,
    }
  })
}
export interface Props {
  setActiveFilter: (active: Option) => void
  setStatusFilter: (filter: Option) => void
  currentStatusFilter: StandardTextsAdminValue['statusFilter']
  currentActiveFilter: StandardTextsAdminValue['activeFilter']
  meta?: StandardTextsData['facets']
}

export const Filter = ({
  setStatusFilter,
  setActiveFilter,
  currentStatusFilter,
  currentActiveFilter,
  meta,
}: Props) => {
  const onStatusChange = (_groupName: string, option: RadioButtonOption) => {
    setStatusFilter(option)
  }

  const onActiveChange = (_groupName: string, option: RadioButtonOption) => {
    setActiveFilter(option)
  }

  const statusOptions = getStatusOptions(changeStatusOptionList, meta?.state)
  const activeOptions = getActiveOptions(meta?.active)

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
