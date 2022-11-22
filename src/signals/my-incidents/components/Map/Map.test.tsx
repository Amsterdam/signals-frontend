/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { render, screen } from '@testing-library/react'

import { Map } from '.'
import { withAppContext } from '../../../../test/utils'
import { incidentsDetail } from '../../__test__/incidents-detail'

const close = jest.fn()

describe('IncidentsDetail', () => {
  it('should render correctly', () => {
    render(
      withAppContext(<Map close={close} location={incidentsDetail.location} />)
    )

    expect(screen.getByTestId('mapDetail')).toBeInTheDocument()
  })
})
