// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import Button from '..'

describe('src/components/Button', () => {
  it('should render correctly', () => {
    const buttonText = 'buttonText'
    const { container, getByText } = render(
      withAppContext(<Button>{buttonText}</Button>)
    )

    expect(getByText(buttonText)).toBeInTheDocument()

    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
  })
})
