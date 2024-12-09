// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { renderHook, act } from '@testing-library/react-hooks'
import fetchMock from 'jest-fetch-mock'

import configuration from 'shared/services/configuration/configuration'

import signalsOpenReport from '../../../../internals/mocks/fixtures/report_signals-open.json'
import useGetReportOpen from '../useGetReportOpen'

const URL = `${configuration.REPORTS_ENDPOINT}open`

// TODO: these tests broke when updating MSW, should be fixed
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('hooks/useGetReportOpen', () => {
  beforeAll(() => {
    fetchMock.mockResponse(JSON.stringify(signalsOpenReport))
  })

  it('returns instance of useFetch', async () => {
    const { result } = renderHook(() => useGetReportOpen())

    expect(result.current.get).toBeInstanceOf(Function)

    expect(fetchMock).not.toHaveBeenCalled()

    await act(() => result.current.get())

    expect(fetchMock).toHaveBeenCalledWith(
      URL,
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('sends start and end parameters', async () => {
    const { result } = renderHook(() => useGetReportOpen())
    const start = new Date().toISOString()

    await act(() => result.current.get({ start }))

    expect(fetchMock).toHaveBeenCalledWith(
      `${URL}?start=${start}`,
      expect.objectContaining({ method: 'GET' })
    )

    const endDate = new Date()
    endDate.setDate(endDate.getDate() - 3)
    const end = endDate.toISOString()

    await act(() => result.current.get({ end }))

    expect(fetchMock).toHaveBeenLastCalledWith(
      `${URL}?end=${end}`,
      expect.objectContaining({ method: 'GET' })
    )

    await act(() => result.current.get({ end, start }))

    expect(fetchMock).toHaveBeenLastCalledWith(
      `${URL}?start=${start}&end=${end}`,
      expect.objectContaining({ method: 'GET' })
    )
  })
})
