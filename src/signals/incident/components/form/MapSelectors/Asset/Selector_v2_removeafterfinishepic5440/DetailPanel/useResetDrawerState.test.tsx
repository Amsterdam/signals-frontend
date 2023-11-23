// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { renderHook } from '@testing-library/react-hooks'

import { useResetDrawerState } from './useResetDrawerState'
import { DrawerState } from '../../../../../../../../components/DrawerOverlay'

const setDrawerStateMock = jest.fn()
describe('useResetDrawerState', () => {
  beforeEach(() => {
    setDrawerStateMock.mockReset()
  })
  it('should call setDrawerStateMock', () => {
    renderHook(() =>
      useResetDrawerState(DrawerState.Closed, setDrawerStateMock, 10)
    )

    expect(setDrawerStateMock).toHaveBeenCalledWith(DrawerState.Open)
  })

  it('should not call setDrawerStateMock when drawstate is open', () => {
    renderHook(() =>
      useResetDrawerState(DrawerState.Open, setDrawerStateMock, 10)
    )

    expect(setDrawerStateMock).not.toHaveBeenCalledWith(DrawerState.Closed)
    expect(setDrawerStateMock).not.toHaveBeenCalledWith(DrawerState.Open)
  })

  it('should not call setDrawerStateMock when zoomlevel is 13 or bigger', () => {
    renderHook(() =>
      useResetDrawerState(DrawerState.Closed, setDrawerStateMock, 13)
    )

    expect(setDrawerStateMock).not.toHaveBeenCalledWith(DrawerState.Closed)
    expect(setDrawerStateMock).not.toHaveBeenCalledWith(DrawerState.Open)
  })
})
