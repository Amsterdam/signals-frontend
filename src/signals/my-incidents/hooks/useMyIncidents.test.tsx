import { act, renderHook } from '@testing-library/react-hooks'

import { incidentsList } from '../__test__/incidents-list'
import { useMyIncidents } from './useMyIncidents'

describe('useMyIncidents', () => {
  it('should update and return values', () => {
    const { result } = renderHook(useMyIncidents)

    const { setEmail, setIncidentsList } = result.current

    act(() => setEmail('test@email.com'))
    act(() => setIncidentsList(incidentsList))

    expect(result.current.email).toEqual('test@email.com')
    expect(result.current.incidentsList).toEqual(incidentsList)
  })
})
