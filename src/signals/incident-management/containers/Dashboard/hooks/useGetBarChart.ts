// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useFetchAll } from 'hooks'

import type { RawData } from '../components/BarChart/types'

export const useGetBarChart = () => {
  const result = useFetchAll<RawData>()

  return result
}
