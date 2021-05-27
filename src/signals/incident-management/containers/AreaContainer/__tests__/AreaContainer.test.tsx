// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import AreaContainer from '..'

describe('<AreaContainer />', () => {
  it('renders', () => {
    render(<AreaContainer />)

    expect(screen.getByText('hello world')).toBeInTheDocument()
  })
})
