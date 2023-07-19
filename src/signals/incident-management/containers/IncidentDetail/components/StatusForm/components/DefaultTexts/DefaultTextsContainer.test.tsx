// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { StatusCode } from 'types/status-code'

import DefaultTextsContainer from './DefaultTextsContainer'
import type { Props } from './DefaultTextsContainer'

jest.mock('./DefaultTexts', () => ({
  __esModule: true,
  default: () => <div>[DefaultTexts]</div>,
}))

const defaultProps: Props = {
  closeDefaultTextModal: jest.fn(),
  defaultTexts: [
    {
      state: StatusCode.Afgehandeld,
      templates: [
        {
          title: 'Titel 1',
          text: 'Er is een accu gevonden en deze is meegenomen',
          is_active: true,
        },
        {
          title: '222',
          text: 'sdfsdfsdf',
          is_active: true,
        },
        {
          title: 'Asbest',
          text: 'Er is asbest gevonden en dit zal binnen 3 werkdagen worden opgeruimd.',
          is_active: true,
        },
      ],
    },
  ],
  modalDefaultTextIsOpen: true,
  openDefaultTextModal: jest.fn(),
  status: StatusCode.Afgehandeld,
  useDefaultText: jest.fn(),
}

describe('DefaultTextsContainer', () => {
  it('should render correctly', () => {
    render(<DefaultTextsContainer {...defaultProps} />)

    expect(screen.getByText('Standaardtekst (3)')).toBeInTheDocument()
    expect(screen.getByText('[DefaultTexts]')).toBeInTheDocument()
  })

  it('should render not render modal when closed', () => {
    render(
      <DefaultTextsContainer {...defaultProps} modalDefaultTextIsOpen={false} />
    )

    expect(screen.queryByText('[DefaultTexts]')).not.toBeInTheDocument()
  })

  it('should not render anything when there are no texts', () => {
    render(
      <DefaultTextsContainer
        {...defaultProps}
        modalDefaultTextIsOpen={true}
        defaultTexts={[]}
      />
    )

    expect(screen.getByText('Standaardtekst (0)')).toBeInTheDocument()
  })
})
