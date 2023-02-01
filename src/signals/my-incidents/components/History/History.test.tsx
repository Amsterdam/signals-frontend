/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'

import { History } from './index'
import useFetch from '../../../../hooks/useFetch'
import { withAppContext } from '../../../../test/utils'
import { get, useFetchResponse } from '../../../IncidentMap/components/__test__'
import { defaultHistoryData } from '../../__test__'
import { incidentsDetail } from '../../__test__/incidents-detail'

jest.mock('hooks/useFetch')

const mockPush = jest.fn()

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}))

describe('History', () => {
  beforeEach(() => {
    get.mockReset()
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
  })

  it('should render correctly', () => {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: defaultHistoryData,
    }))

    render(
      withAppContext(
        <History
          incident={incidentsDetail}
          fetchResponse={{ data: defaultHistoryData, error: undefined }}
        />
      )
    )

    expect(screen.getByText('Geschiedenis')).toBeInTheDocument()
    expect(screen.getByText('16 december 2022, 13:00')).toBeInTheDocument()
  })

  it('should not render dates', function () {
    jest.mocked(useFetch).mockImplementation(() => ({
      ...useFetchResponse,
      data: [],
    }))

    render(
      withAppContext(
        <History
          incident={incidentsDetail}
          fetchResponse={{ data: [], error: undefined }}
        />
      )
    )

    expect(screen.getByText('Geschiedenis')).toBeInTheDocument()
    expect(
      screen.queryByText('16 december 2022, 13:00')
    ).not.toBeInTheDocument()
  })

  it('should push to expired page', function () {
    render(
      withAppContext(
        <History
          incident={incidentsDetail}
          fetchResponse={{ data: [], error: true }}
        />
      )
    )

    expect(mockPush).toBeCalled()
  })
})
