// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import 'jest-styled-components'

import { withAppContext } from 'test/utils'

import IncidentDetailContext from '../../../../context'
import Attachments from '.'

const attachmentProps = {
  attachments: [
    {
      location:
        'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/07/02/landscape_3.jpg?temp_url_sig=96364a8c62ff29d18135b929c86533bea63179b0&temp_url_expires=1564671767',
    },
    {
      location:
        'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/07/02/landscape_2.jpg?temp_url_sig=fb4dd645ead47becc77e521e651fc3a5c4a2adb5&temp_url_expires=1564671767',
    },
    {
      location:
        'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/attachments/2019/07/02/landscape.jpg?temp_url_sig=fcc774586a87496aec433c61eea802f27df45664&temp_url_expires=1564671767',
    },
  ],
}

const preview = jest.fn()

const renderWithContext = (props = attachmentProps) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ preview }}>
      <Attachments {...props} />
    </IncidentDetailContext.Provider>
  )

describe('<Attachments />', () => {
  beforeEach(() => {
    preview.mockReset()
  })

  describe('rendering', () => {
    it('should render all attachments when they are defined', () => {
      const { queryByTestId, queryAllByTestId } = render(renderWithContext())

      expect(queryByTestId('attachmentsDefinition')).toHaveTextContent(/^Foto$/)
      expect(queryAllByTestId('attachmentsValueButton')).toHaveLength(3)

      expect(queryAllByTestId('attachmentsValueButton')[0]).toHaveStyleRule(
        'background-image',
        `url(${attachmentProps.attachments[0].location})`
      )
    })

    it('should render empty list when no attachments are defined', () => {
      const { queryByTestId, queryAllByTestId } = render(
        renderWithContext({ attachments: [] })
      )

      expect(queryByTestId('attachmentsDefinition')).toBeNull()
      expect(queryAllByTestId('attachmentsValueButton')).toHaveLength(0)
    })
  })

  describe('events', () => {
    it('should trigger opening the attachment', () => {
      const { queryAllByTestId } = render(renderWithContext())

      expect(preview).not.toHaveBeenCalled()

      act(() => {
        fireEvent.click(queryAllByTestId('attachmentsValueButton')[0])
      })

      expect(preview).toHaveBeenCalledWith('attachment', {
        attachmentHref: attachmentProps.attachments[0].location,
      })
    })
  })
})
