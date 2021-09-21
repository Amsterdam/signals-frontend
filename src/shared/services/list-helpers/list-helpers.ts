// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam

import listIcons from 'signals/incident-management/definitions/listIcons'
import {
  Definition,
  Priority,
} from 'signals/incident-management/definitions/types'

export const getListValueByKey = (
  list?: Definition[],
  key?: Definition['key'] | null
) => {
  const comparator =
    list && key ? (s: Definition) => s.key === key : (s: Definition) => !s.key
  const item = list?.find(comparator)
  const value = item ? item.value : 'Niet gevonden'

  return item || key ? value : false
}

export const getListIconByKey = (list: Priority[], key?: Definition['key']) => {
  const iconName = list.find((item) => item.key === key)?.icon

  return iconName ? listIcons[iconName] : null
}
