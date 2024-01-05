// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'

const scrollPositions: { [key: string]: number } = {}

// Custom hook to restore scroll position on navigation.
// Replace with react-router ScrollRestoration when redux-first-history supports it
const useRestoreScrollPosition = (page: string) => {
  const location = useLocation()

  useEffect(() => {
    let timeoutIdScroll: ReturnType<typeof setTimeout>
    let timeoutIdSave: ReturnType<typeof setTimeout>
    const pageScrollPosition = scrollPositions[page]

    if (pageScrollPosition) {
      // We're using setTimeout here to ensure we're setting the
      // scroll position after other js execution is done
      timeoutIdScroll = setTimeout(() => {
        window.scrollTo(0, pageScrollPosition)
        clearTimeout(timeoutIdScroll)
      }, 0)
    }

    const save = () => {
      // We're using setTimeout here to ensure we're saving the
      // scroll position after other js execution is done

      timeoutIdSave = setTimeout(() => {
        // Safari sets scrollY to 0 when navigating, therefor we make an excpetion for 0
        if (location.pathname === page && window.scrollY > 0) {
          scrollPositions[page] = window.scrollY
        }
      }, 0)
    }

    window.addEventListener('scroll', save)

    return () => {
      window.removeEventListener('scroll', save)
      clearTimeout(timeoutIdScroll)
      clearTimeout(timeoutIdSave)
    }
  }, [location.pathname, page])
}

export default useRestoreScrollPosition
