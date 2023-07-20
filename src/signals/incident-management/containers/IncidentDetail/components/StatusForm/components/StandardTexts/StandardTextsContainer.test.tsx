// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { StatusCode } from 'types/status-code'

import StandardTextsContainer from './StandardTextsContainer'
import type { Props } from './StandardTextsContainer'

jest.mock('./StandardTexts', () => ({
  __esModule: true,
  StandardTexts: () => <div>[StandardTexts]</div>,
}))

const defaultProps: Props = {
  closeStandardTextModal: jest.fn(),
  standardTexts: {
    results: [
      {
        id: 43,
        title: 'wit',
        text: 'bruin en wit',
        active: true,
        state: StatusCode.Behandeling,
        categories: [176],
        meta: {},
      },
      {
        id: 45,
        title: 'Behandeling en tot ziens',
        text: 'We hebben je melding in behandeling. Tot ziens.',
        active: true,
        state: StatusCode.Behandeling,
        categories: [176],
        meta: {},
      },
    ],
  },
  modalStandardTextIsOpen: true,
  openStandardTextModal: jest.fn(),
  status: StatusCode.Behandeling,
  useStandardText: jest.fn(),
}

describe('StandardTextsContainer', () => {
  it('should render correctly', () => {
    render(<StandardTextsContainer {...defaultProps} />)

    expect(screen.getByText('Standaardtekst (2)')).toBeInTheDocument()
    expect(screen.getByText('[StandardTexts]')).toBeInTheDocument()
  })

  it('should render not render modal when closed', () => {
    render(
      <StandardTextsContainer
        {...defaultProps}
        modalStandardTextIsOpen={false}
      />
    )

    expect(screen.queryByText('[StandardTexts]')).not.toBeInTheDocument()
  })
})
