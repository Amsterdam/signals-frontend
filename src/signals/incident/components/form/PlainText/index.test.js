// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/* eslint-disable  react/prop-types */
import { render, screen } from '@testing-library/react'
import 'jest-styled-components'

import * as auth from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import PlainText from '.'

jest.mock('shared/services/auth/auth')
jest.mock('shared/services/configuration/configuration')

describe('Form component <PlainText />', () => {
  const metaProps = {
    value: 'Lorem Ipsum',
    isVisible: true,
  }
  const incidentId = 666

  const getProps = (meta = metaProps) => ({
    meta,
    parent: {
      meta: {
        incidentContainer: {
          incident: {
            id: incidentId,
          },
        },
      },
    },
  })

  beforeEach(() => {
    jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)
  })

  afterEach(() => {
    jest.resetAllMocks()
    configuration.__reset()
  })

  describe('rendering', () => {
    it('should render plain text correctly', () => {
      const props = getProps({ ...metaProps, label: 'Label' })

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...props} />)
      )

      expect(getByTestId('plainText')).toBeInTheDocument()
      expect(getByText(props.meta.value)).toBeInTheDocument()
    })

    it('should render plain text with links correctly when NOT authenticated', () => {
      const linkText = 'the-link'
      const linkAuthenticatedText = 'auth-link'
      const props = getProps({
        ...metaProps,
        label: 'Label',
        valueAuthenticated: `${linkAuthenticatedText}: [{incident.id}](/manage/incident/{incident.id}).`,
        value: `${linkText}: {incident.id}.`,
      })

      render(withAppContext(<PlainText {...props} />))
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
      const props = getProps({
        ...metaProps,
        label: 'Label',
        valueAuthenticated: `${linkAuthenticatedText}: [{incident.id}](/manage/incident/{incident.id}).`,
        value: `${linkText}: {incident.id}.`,
      })

      render(withAppContext(<PlainText {...props} />))
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
      const props = getProps({
        ...metaProps,
        type: 'citation',
      })

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...props} />)
      )

      expect(getByTestId('plainText')).toBeInTheDocument()
      expect(getByText(props.meta.value)).toBeInTheDocument()

      const element = getByTestId('plainText')
      expect(element).toHaveStyleRule('padding', '20px')
      expect(element).toHaveStyleRule('background-color', '#E6E6E6')
    })

    it('should render plain text default correctly', () => {
      const props = getProps({
        ...metaProps,
        type: '',
        value: 'Default',
      })

      render(withAppContext(<PlainText {...props} />))

      expect(screen.getByTestId('plainText')).toBeInTheDocument()
      expect(screen.getByText(props.meta.value)).toBeInTheDocument()

      const element = screen.getByTestId('plainText')
      expect(element).toHaveStyleRule('color', '#767676')
    })

    it('should render plain text info correctly', () => {
      const props = getProps({
        ...metaProps,
        type: 'info',
      })

      render(withAppContext(<PlainText {...props} />))

      expect(screen.getByTestId('plainText')).toBeInTheDocument()
      expect(screen.getByText(props.meta.value)).toBeInTheDocument()

      const element = screen.getByTestId('plainText')
      expect(element).toHaveStyleRule('padding', '20px')
      expect(element).toHaveStyleRule('background-color', '#004699')
    })

    it('should render plain text caution correctly', () => {
      const props = getProps({
        ...metaProps,
        value: 'Caution',
        type: 'caution',
      })

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...props} />)
      )

      expect(getByTestId('plainText')).toBeInTheDocument()
      expect(getByText(props.meta.value)).toBeInTheDocument()

      const element = getByTestId('plainText')
      expect(element).toHaveStyleRule('padding-left', '12px')
      expect(element).toHaveStyleRule('border-left', '3px solid #ec0000')
    })

    it('should render plain text alert correctly', () => {
      const props = getProps({
        ...metaProps,
        type: 'alert',
      })

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...props} />)
      )

      expect(getByTestId('plainText')).toBeInTheDocument()
      expect(getByText(props.meta.value)).toBeInTheDocument()

      const element = getByTestId('plainText')
      expect(element).toHaveStyleRule('color', '#ec0000')
      expect(element).toHaveStyleRule('padding', '8px 20px')
      expect(element).toHaveStyleRule('border', '2px solid #ec0000')
    })

    it('should render plain text alert-inverted correctly', () => {
      const props = getProps({
        ...metaProps,
        type: 'alert-inverted',
      })

      const { getByTestId, getByText } = render(
        withAppContext(<PlainText {...props} />)
      )

      expect(getByTestId('plainText')).toBeInTheDocument()
      expect(getByText(props.meta.value)).toBeInTheDocument()

      const element = getByTestId('plainText')
      expect(element).toHaveStyleRule('background-color', '#ec0000')
      expect(element).toHaveStyleRule('color', '#ffffff')
      expect(element).toHaveStyleRule('padding', '16px')
    })

    it('should render no plain text when not visible', () => {
      const props = getProps({
        ...metaProps,
        isVisible: false,
      })

      render(withAppContext(<PlainText {...props} />))
      expect(screen.queryByTestId('plainText')).not.toBeInTheDocument()
      expect(screen.queryByText(props.meta.value)).not.toBeInTheDocument()
    })

    it('should render no plain text without meta', () => {
      const props = getProps(null)

      render(withAppContext(<PlainText {...props} />))
      expect(screen.queryByTestId('plainText')).not.toBeInTheDocument()
    })

    it('should render no plain text without meta when authenticated', () => {
      jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => true)
      const props = getProps(null)

      render(withAppContext(<PlainText {...props} />))
      expect(screen.queryByTestId('plainText')).not.toBeInTheDocument()
    })
  })
})
