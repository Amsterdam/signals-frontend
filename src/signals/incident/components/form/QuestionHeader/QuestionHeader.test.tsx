// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { QuestionHeader } from './QuestionHeader'

describe('QuestionHeader', () => {
  it('should render', () => {
    const meta = {
      label: 'label',
    }
    render(<QuestionHeader meta={meta} />)

    expect(screen.getByText('label')).toBeInTheDocument()
  })
})
