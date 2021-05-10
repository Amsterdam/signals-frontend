// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useRef } from 'react'

const useDebounce = (func, wait) => {
  const timeout = useRef(null)

  return function (...args) {
    const that = this

    if (timeout.current) clearTimeout(timeout.current)

    timeout.current = setTimeout(() => {
      func.apply(that, args)
      clearTimeout(timeout.current)
    }, wait)
  }
}

export default useDebounce
