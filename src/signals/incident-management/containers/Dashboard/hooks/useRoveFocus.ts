// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useState, useEffect } from 'react'

export function useRoveFocus(size: number) {
  const [currentFocus, setCurrentFocus] = useState<number>(0)

  const handleKeyDown = useCallback(
    (e) => {
      if (e.code === 'ArrowDown') {
        setCurrentFocus(currentFocus === size - 1 ? 0 : currentFocus + 1)
      } else if (e.code === 'ArrowUp') {
        setCurrentFocus(currentFocus === 0 ? size - 1 : currentFocus - 1)
      }
    },
    [size, currentFocus, setCurrentFocus]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
    }
  }, [handleKeyDown])

  return { currentFocus, setCurrentFocus }
}
