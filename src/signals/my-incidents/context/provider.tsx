// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'

import type { MyIncidentsValue } from '../types'
import { MyIncidentsContext } from './context'

export const initialValue: MyIncidentsValue = {
  email: undefined,
  setEmail: () => {},
}

interface Props {
  children: ReactNode
  value?: MyIncidentsValue
}

export const MyIncidentsProvider: FC<Props> = ({ value, children }) => {
  const newValue = useMemo(
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
