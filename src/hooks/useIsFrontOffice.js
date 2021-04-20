// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const useIsFrontOffice = () => {
  const location = useLocation()

  return useMemo(
    () =>
      !location.pathname.startsWith('/manage') &&
      !location.pathname.startsWith('/instellingen'),
    [location.pathname]
  )
}

export default useIsFrontOffice
