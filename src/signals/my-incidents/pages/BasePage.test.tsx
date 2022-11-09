// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import { BasePage } from './BasePage'
import type { Props } from './BasePage'

const defaultProps: Props = {
  paragraphs: ['I am a paragraph', 'I the second paragraph'],
  buttons: <button>Button</button>,
  pageInfo: {
    documentTitle: 'Document Title',
    dataTestId: 'basePage',
    pageTitle: 'Page Title',
  },
}

describe('BasePage', () => {
  it('should render correctly', () => {
    render(withAppContext(<BasePage {...defaultProps} />))

    expect(screen.getByText('Page Title')).toBeInTheDocument()
    expect(screen.getByText('I am a paragraph')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
