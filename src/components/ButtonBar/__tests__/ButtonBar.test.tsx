// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import ButtonBar from '..'

describe('src/components/ButtonBar', () => {
  it('should render correctly', () => {
    const label = 'I am a buttonBar'
    const className = 'foo'

    render(withAppContext(<ButtonBar className={className}>{label}</ButtonBar>))

    const bar = screen.getByText(label)

    expect(bar).toBeInTheDocument()
    expect(bar).toHaveClass(className)
  })
})
