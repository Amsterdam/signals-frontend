/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2023 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import { History } from './index'
import useFetch from '../../../../hooks/useFetch'
import { withAppContext } from '../../../../test/utils'
import { get, useFetchResponse } from '../../../IncidentMap/components/__test__'
import { defaultHistoryData } from '../../__test__'
import { incidentsDetail } from '../../__test__/incidents-detail'

jest.mock('hooks/useFetch')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
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
    const navigateMock = jest.fn()
    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementationOnce(() => navigateMock)

    render(
      withAppContext(
        <History
          incident={incidentsDetail}
          fetchResponse={{ data: [], error: true }}
        />
      )
    )

    expect(navigateMock).toBeCalled()
  })
})
