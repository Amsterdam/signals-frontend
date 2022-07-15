// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const useIsIncidentMap = () => {
  const location = useLocation()

  return useMemo(
    () => location.pathname.startsWith('/meldingenkaart'),
    [location.pathname]
  )
}

export default useIsIncidentMap
