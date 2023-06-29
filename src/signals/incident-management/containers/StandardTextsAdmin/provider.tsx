// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
/* istanbul ignore file */
import type { ReactNode } from 'react'

import { StandardTextsAdminContext } from './context'
import type { StandardTextsAdminValue } from './types'

export const initialValue: StandardTextsAdminValue = {
  page: 1,
  setPage: () => {},
}

interface Props {
  children: ReactNode
  value: StandardTextsAdminValue
}

export const StandardTextsAdminProvider = ({ value, children }: Props) => {
  return (
    <StandardTextsAdminContext.Provider value={{ ...value }}>
      {children}
    </StandardTextsAdminContext.Provider>
  )
}

export default StandardTextsAdminContext