import { act, renderHook } from '@testing-library/react-hooks'
import fetchMock from 'jest-fetch-mock'

import configuration from 'shared/services/configuration/configuration'

import { usePostEmail } from './usePostEmail'

const URL = `${configuration.MY_SIGNALS_LOGIN_URL}`

describe('usePostEmail', () => {
  it('should post email', async () => {
    const { result } = renderHook(usePostEmail)

    const [postEmail] = result.current

    expect(fetchMock).not.toHaveBeenCalled()

    await act(() => postEmail('test@email.com'))

    expect(fetchMock).toHaveBeenCalledWith(
      URL,
      expect.objectContaining({ method: 'POST' })
    )
  })
})
