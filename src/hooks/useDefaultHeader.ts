// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useMemo } from 'react'

import { useLocation } from 'react-router-dom'

const useDefaultHeader = () => {
  const location = useLocation()
  const routesWithCustomHeader = ['/meldingenkaart']

  return useMemo(
    () =>
      !routesWithCustomHeader.some((route: string) =>
        location.pathname.startsWith(route)
      ),
    [location.pathname, routesWithCustomHeader]
  )
}

export default useDefaultHeader
