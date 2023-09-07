// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'

import { resizeWindow } from '__tests__/utils'
import { useDeviceMode } from 'hooks/useDeviceMode'

describe('useDeviceMode', () => {
  it('should give the correct deviceMode {Desktop)', () => {
    const { result } = renderHook(() => useDeviceMode())

    expect(result.current).toEqual('DESKTOP')
  })

  it('should give the correct deviceMode (Mobile)', () => {
    resizeWindow(400, 1200)
    const { result } = renderHook(() => useDeviceMode())

    expect(result.current).toEqual('MOBILE')
  })
})
