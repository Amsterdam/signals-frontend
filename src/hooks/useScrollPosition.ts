// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'

const scrollPositions: { [key: string]: number } = {}

const useScrollPosition = (page: string) => {
  const location = useLocation()

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    let timeoutIdSave: ReturnType<typeof setTimeout>
    const pageScrollPosition = scrollPositions[page]

    if (pageScrollPosition) {
      timeoutId = setTimeout(() => {
        window.scrollTo(0, pageScrollPosition)
        clearTimeout(timeoutId)
      }, 50)
    }

    const save = () => {
      timeoutIdSave = setTimeout(() => {
        if (location.pathname === page) {
          scrollPositions[page] = window.scrollY
        }
      }, 10)
    }

    window.addEventListener('scroll', save)

    return () => {
      window.removeEventListener('scroll', save)
      clearTimeout(timeoutId)
      clearTimeout(timeoutIdSave)
    }
  }, [location, page])
}

export default useScrollPosition
