// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { themeColor, ascDefaultTheme } from '@amsterdam/asc-ui'
import { render, screen } from '@testing-library/react'
import 'jest-styled-components'

import * as auth from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import PlainText from './PlainText'
import type { Props } from './PlainText'

jest.mock('shared/services/auth/auth')
jest.mock('shared/services/configuration/configuration')

const incidentId = 666

const defaultProps: Props = {
  className: 'dummy-name',
  parent: {
    meta: {
      incidentContainer: {
        incident: {
          id: incidentId,
        },
      },
    },
  } as unknown as Props['parent'],
  meta: {
    value: 'Lorem Ipsum',
    isVisible: true,
  } as Props['meta'],
}

describe('Form component <PlainText />', () => {
  beforeEach(() => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)
  })

  afterEach(() => {
    jest.resetAllMocks()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configuration.__reset()
  })

  describe('rendering', () => {
    it('should render plain text correctly', () => {
      render(
        withAppContext(
          <PlainText
            {...defaultProps}
            meta={{ ...defaultProps.meta, label: 'label' }}
          />
        )
      )

      expect(screen.getByTestId('plain-text')).toBeInTheDocument()
      expect(screen.getByText(defaultProps.meta.value)).toBeInTheDocument()
    })

    it('should render plain text with links correctly when NOT authenticated', () => {
      const linkText = 'the-link'
      const linkAuthenticatedText = 'auth-link'
      const customMeta = {
        ...defaultProps.meta,
        label: 'Label',
        valueAuthenticated: `${linkAuthenticatedText}: [{incident.id}](/manage/incident/{incident.id}).`,
        value: `${linkText}: {incident.id}.`,
      }

      render(withAppContext(<PlainText {...defaultProps} meta={customMeta} />))
      expect(screen.getByText(linkText, { exact: false })).toBeInTheDocument()
      expect(
        screen.queryByText(linkAuthenticatedText, { exact: false })
      ).not.toBeInTheDocument()
      expect(
        screen.getByText(incidentId.toString(), { exact: false })
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: incidentId.toString() })
      ).not.toBeInTheDocument()
    })

    it('should render plain text with links correctly when authenticated', () => {
      jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)
      const linkText = 'the-link'
      const linkAuthenticatedText = 'auth-link'
      const customMeta = {
        ...defaultProps.meta,
        label: 'Label',
        valueAuthenticated: `${linkAuthenticatedText}: [{incident.id}](/manage/incident/{incident.id}).`,
        value: `${linkText}: {incident.id}.`,
      }

      render(withAppContext(<PlainText {...defaultProps} meta={customMeta} />))
      expect(
        screen.queryByText(linkText, { exact: false })
      ).not.toBeInTheDocument()
      expect(
        screen.getByText(linkAuthenticatedText, { exact: false })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: incidentId.toString() })
      ).toBeInTheDocument()
    })

    it('should render plain text citation correctly', () => {
      const customMeta = {
        ...defaultProps.meta,
        type: 'citation',
      }

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...defaultProps} meta={customMeta} />)
      )

      expect(getByTestId('plain-text')).toBeInTheDocument()
      expect(getByText(defaultProps.meta.value)).toBeInTheDocument()

      const element = getByTestId('plain-text')
      expect(element).toHaveStyleRule('padding', '20px')
      expect(element).toHaveStyleRule(
        'background-color',
        themeColor('tint', 'level3')({ theme: ascDefaultTheme })
      )
    })

    it('should render plain text info correctly', () => {
      const customMeta = {
        ...defaultProps.meta,
        type: 'info',
      }

      render(withAppContext(<PlainText {...defaultProps} meta={customMeta} />))

      expect(screen.getByTestId('plain-text')).toBeInTheDocument()
      expect(screen.getByText(defaultProps.meta.value)).toBeInTheDocument()

      const element = screen.getByTestId('plain-text')
      expect(element).toHaveStyleRule('padding', '20px')
      expect(element).toHaveStyleRule('background-color', '#004699')
    })

    it('should render plain text caution correctly', () => {
      const customMeta = {
        ...defaultProps.meta,
        value: 'Caution',
        type: 'caution',
      }

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...defaultProps} meta={customMeta} />)
      )

      expect(getByTestId('plain-text')).toBeInTheDocument()
      expect(getByText(customMeta.value)).toBeInTheDocument()

      const element = getByTestId('plain-text')
      expect(element).toHaveStyleRule('padding-left', '12px')
      expect(element).toHaveStyleRule('border-left', '3px solid #ec0000')
    })

    it('should render plain text alert correctly', () => {
      const customMeta = {
        ...defaultProps.meta,
        type: 'alert',
      }

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...defaultProps} meta={customMeta} />)
      )

      expect(getByTestId('plain-text')).toBeInTheDocument()
      expect(getByText(defaultProps.meta.value)).toBeInTheDocument()

      const element = getByTestId('plain-text')
      expect(element).toHaveStyleRule('color', '#ec0000')
      expect(element).toHaveStyleRule('padding', '8px 20px')
      expect(element).toHaveStyleRule('border', '2px solid #ec0000')
    })

    it('should render plain text alert-inverted correctly', () => {
      const customMeta = {
        ...defaultProps.meta,
        type: 'alert-inverted',
      }

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...defaultProps} meta={customMeta} />)
      )

      expect(getByTestId('plain-text')).toBeInTheDocument()
      expect(getByText(defaultProps.meta.value)).toBeInTheDocument()

      const element = getByTestId('plain-text')
      expect(element).toHaveStyleRule('background-color', '#ec0000')
      expect(element).toHaveStyleRule('color', '#ffffff')
      expect(element).toHaveStyleRule('padding', '16px')
    })

    it('should render plain text message correctly', () => {
      const customMeta = {
        ...defaultProps.meta,
        type: 'message',
      }

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...defaultProps} meta={customMeta} />)
      )

      expect(getByTestId('plain-text')).toBeInTheDocument()
      expect(getByText(defaultProps.meta.value)).toBeInTheDocument()

      const element = getByTestId('plain-text')
      expect(element).toHaveStyleRule('color', '#000000')
    })

    it('should render no plain text when not visible', () => {
      const customMeta = {
        ...defaultProps.meta,
        isVisible: false,
      }

      render(withAppContext(<PlainText {...defaultProps} meta={customMeta} />))
      expect(screen.queryByTestId('plain-text')).not.toBeInTheDocument()
      expect(
        screen.queryByText(defaultProps.meta.value)
      ).not.toBeInTheDocument()
    })
  })
})
