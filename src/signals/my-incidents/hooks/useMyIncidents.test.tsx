import { act, renderHook } from '@testing-library/react-hooks'

import { useMyIncidents } from './useMyIncidents'

describe('useMyIncidents', () => {
  it('should update and return values', () => {
    const { result } = renderHook(useMyIncidents)

    const { setEmail } = result.current

    act(() => setEmail('test@email.com'))

    expect(result.current.email).toEqual('test@email.com')
  })
})
