// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'
import * as reactRouterDom from 'react-router-dom'

import { ConfirmationProvider } from 'containers/Confirmation/ConfirmationProvider'
import * as useConfirm from 'hooks/useConfirm'

import useConfirmedCancel, {
  confirmationMessage,
  title,
} from './useConfirmedCancel'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const navigateMock = jest.fn()
const isConfirmedMock = jest.fn()

jest.spyOn(useConfirm, 'useConfirm').mockImplementation(() => {
  return {
    isConfirmed: isConfirmedMock,
  }
})

jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateMock)

const redirectURL = 'https://redirect-me-here'

describe('signals/settings/hooks/useConfirmedCancel', () => {
  it('should navigate when isPristine is true, or isPristine is false and IsCOnfirmed is true', async () => {
    const renderhookOptions = {
      wrapper: ({ children }) => (
        <ConfirmationProvider>{children}</ConfirmationProvider>
      ),
    }
    const { result } = renderHook(
      () => useConfirmedCancel(redirectURL),
      renderhookOptions
    )

    expect(isConfirmedMock).not.toHaveBeenCalled()

    await result.current(true)

    expect(isConfirmedMock).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalled()

    navigateMock.mockReset()

    await result.current(false)

    expect(isConfirmedMock).toHaveBeenCalledWith(title, confirmationMessage)
    expect(navigateMock).not.toHaveBeenCalled()

    isConfirmedMock.mockReset()
    isConfirmedMock.mockReturnValue(true)

    await result.current(false)

    expect(isConfirmedMock).toHaveBeenCalledWith(title, confirmationMessage)
    expect(navigateMock).toHaveBeenCalledWith(redirectURL)
  })
})
