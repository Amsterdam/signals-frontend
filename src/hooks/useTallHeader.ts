// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useMemo } from 'react'

import { useLocation } from 'react-router-dom'

const useTallHeader = () => {
  const location = useLocation()
  return useMemo(
    () => location.pathname.startsWith('/mijn-meldingen'),
    [location.pathname]
  )
}

export default useTallHeader
