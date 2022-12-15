// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useMemo } from 'react'

import { useLocation } from 'react-router-dom'

const useDefaultHeader = () => {
  const location = useLocation()
  const routesWithoutBackofficeAccess = ['/meldingenkaart']

  return useMemo(
    () =>
      !routesWithoutBackofficeAccess.some((route: string) =>
        location.pathname.startsWith(route)
      ),
    [location.pathname, routesWithoutBackofficeAccess]
  )
}

export default useDefaultHeader
