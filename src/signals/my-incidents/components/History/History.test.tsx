/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'

import useFetch from '../../../../hooks/useFetch'
import { withAppContext } from '../../../../test/utils'
import { get, useFetchResponse } from '../../../IncidentMap/components/__test__'
import { defaultHistoryData } from '../../__test__/default-history-data'
import { incidentsDetail } from '../../__test__/incidents-detail'
import { History } from './index'

jest.mock('hooks/useFetch')

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
          fetchResponse={{ data: defaultHistoryData, error: undefined }}
        />
      )
    )

    expect(screen.getByText('Geschiedenis')).toBeInTheDocument()
    expect(
      screen.queryByText('16 december 2022, 13:00')
    ).not.toBeInTheDocument()
  })
})
