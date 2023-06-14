// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'
import * as reactRouterDom from 'react-router-dom'

import useConfirmedCancel, { confirmationMessage } from './useConfirmedCancel'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const navigateMock = jest.fn()
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateMock)

const redirectURL = 'https://redirect-me-here'

global.window.confirm = jest.fn()

describe('signals/settings/hooks/useConfirmedCancel', () => {
  it('should redirect', () => {
    const pristine = true
    const { result } = renderHook(() => useConfirmedCancel(redirectURL))

    expect(navigateMock).not.toHaveBeenCalled()

    result.current(pristine)

    expect(navigateMock).toHaveBeenCalledWith(redirectURL)

    expect(global.window.confirm).not.toHaveBeenCalled()
  })

  it('should show a confirm', () => {
    const { result } = renderHook(() => useConfirmedCancel(redirectURL))

    expect(global.window.confirm).not.toHaveBeenCalled()

    result.current(true)

    expect(global.window.confirm).not.toHaveBeenCalled()

    expect(navigateMock).toHaveBeenCalled()

    navigateMock.mockReset()

    result.current(false)

    expect(global.window.confirm).toHaveBeenCalledWith(confirmationMessage)

    expect(navigateMock).not.toHaveBeenCalled()

    global.window.confirm.mockReset()
    global.window.confirm.mockReturnValue(true)

    result.current(false)

    expect(global.window.confirm).toHaveBeenCalledWith(confirmationMessage)

    expect(navigateMock).toHaveBeenCalledWith(redirectURL)
  })
})
