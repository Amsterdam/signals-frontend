// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam

import listIcons from 'signals/incident-management/definitions/listIcons'
import { ListItem } from 'signals/incident-management/definitions/types'

export const getListValueByKey = (list?: ListItem[], key?: ListItem['key']) => {
  const comparator =
    list && key ? (s: ListItem) => s.key === key : (s: ListItem) => !s.key
  const item = list?.find(comparator)
  const value = item ? item.value : 'Niet gevonden'

  return item || key ? value : false
}

export const getListIconByKey = (list: ListItem[], key: ListItem['key']) => {
  const iconName = list.find((item) => item.key === key)?.icon

  return iconName ? listIcons[iconName] : null
}
