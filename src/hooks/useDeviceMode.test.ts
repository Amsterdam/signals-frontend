// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'

import { resizeWindow } from '__tests__/utils'
import { DeviceMode, useDeviceMode } from 'hooks/useDeviceMode'

describe('useDeviceMode', () => {
  beforeEach(() => {
    resizeWindow(1920, 1080)
  })

  it('should give the correct deviceMode {Desktop)', () => {
    const { result } = renderHook(() => useDeviceMode())

    expect(result.current.deviceMode).toEqual(DeviceMode.Desktop)
  })

  it('should give the correct deviceMode (Mobile)', () => {
    resizeWindow(400, 1200)
    const { result } = renderHook(() => useDeviceMode())

    expect(result.current.deviceMode).toEqual(DeviceMode.Mobile)
  })

  describe('isMobile', () => {
    it('should return true when mobile', () => {
      resizeWindow(400, 1200)
      const { result } = renderHook(() => useDeviceMode())

      const mobile = result.current.isMobile(result.current.deviceMode)

      expect(mobile).toEqual(true)
    })

    it('should return false when mobile', () => {
      const { result } = renderHook(() => useDeviceMode())

      const mobile = result.current.isMobile(result.current.deviceMode)

      expect(mobile).toEqual(false)
    })
  })

  describe('isDesktop', () => {
    it('should return true when desktop', () => {
      const { result } = renderHook(() => useDeviceMode())

      const mobile = result.current.isDesktop(result.current.deviceMode)

      expect(mobile).toEqual(true)
    })

    it('should return false when mobile', () => {
      resizeWindow(400, 1200)
      const { result } = renderHook(() => useDeviceMode())

      const mobile = result.current.isDesktop(result.current.deviceMode)

      expect(mobile).toEqual(false)
    })
  })
})
