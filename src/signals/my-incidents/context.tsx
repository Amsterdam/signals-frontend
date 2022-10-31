// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { createContext, useMemo } from 'react'
import type { FC } from 'react'

import type { MyIncidentsValue } from './types'

export const initialValue: MyIncidentsValue = {
  email: undefined,
  setEmail: () => {},
}

const MyIncidentsContext = createContext(initialValue)

interface Props {
  value: MyIncidentsValue
}

export const MyIncidentsProvider: FC<Props> = ({ value, children }) => {
  const newValue = useMemo<MyIncidentsValue>(
    () => ({
      ...initialValue,
      ...value,
    }),
    [value]
  )

  return (
    <MyIncidentsContext.Provider value={newValue}>
      {children}
    </MyIncidentsContext.Provider>
  )
}

export default MyIncidentsContext
