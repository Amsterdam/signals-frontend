// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Fragment } from 'react'

import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import 'jest-styled-components'

import Label from './'

describe('signals/incident-management/components/Label', () => {
  it('should render a label element next to an input element', () => {
    render(
      withAppContext(
        <div>
          <Label htmlFor="someOtherElementId">This is my label text</Label>

          <input type="text" id="someOtherElementId" />
        </div>
      )
    )

    expect(screen.queryByText('This is my label text')).toBeInTheDocument()
    expect(screen.getByLabelText('This is my label text')).toBeInTheDocument()
  })

  it('should show the correct font', () => {
    render(
      <Fragment>
        <Label inline>Label 1</Label>

        <Label>Label 2</Label>
      </Fragment>
    )
  })

  it('should show the correct color', () => {
    render(
      withAppContext(
        <Fragment>
          <Label isGroupHeader>Label 1</Label>

          <Label>Label 2</Label>

          <Label isGroupHeader isNewDesignSystem>
            Label 3
          </Label>
        </Fragment>
      )
    )

    expect(screen.getByText('Label 1')).not.toHaveStyleRule('color', 'inherit')
    expect(screen.getByText('Label 2')).toHaveStyleRule('color', 'inherit')
    expect(screen.getByText('Label 3')).toHaveStyleRule('color', 'inherit')
  })
})
