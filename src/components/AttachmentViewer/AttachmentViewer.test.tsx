// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render, fireEvent, act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import AttachmentViewer from '.'
import type { FormattedAttachment } from './AttachmentViewer'

const attachments: FormattedAttachment[] = [
  {
    caption: 'text shown',
    createdAt: '2019-08-05T08:19:16.372476+02:00',
    createdBy: null,
    location: 'https://objectstore.eu/mock/image/1',
    stateShown: 'melder',
  },
  {
    caption: 'text shown',
    createdAt: '2019-08-05T08:19:17.205236+02:00',
    createdBy: 'test@signalen.dev',
    location: 'https://objectstore.eu/mock/image/4/',
    stateShown: 'melder',
  },
  {
    caption: null,
    createdAt: '2019-08-05T08:19:17.205236+02:00',
    createdBy: 'test@signalen.dev',
    location: 'https://objectstore.eu/mock/image/2',
    stateShown: 'melder',
  },
  {
    caption: null,
    createdAt: '2019-08-05T08:19:18.389461+02:00',
    createdBy: 'employee@signalen.dev',
    location: 'https://objectstore.eu/mock/image/3',
    stateShown: 'melder',
  },
]

describe('<AttachmentViewer />', () => {
  const props = {
    attachments,
    onClose: () => {},
  }

  describe('rendering', () => {
    it('on page 1 it should render the correct image and only next button', () => {
      const href = 'https://objectstore.eu/mock/image/1'
      render(withAppContext(<AttachmentViewer {...props} href={href} />))

      expect(
        screen.queryAllByTestId('attachment-viewer-button-previous')
      ).toHaveLength(0)
      expect(
        screen.getAllByTestId('attachment-viewer-button-next')
      ).toHaveLength(1)

      expect(screen.getByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        href
      )
    })

    it('on page 2 it should render the correct image and both previous and next button', () => {
      const href = 'https://objectstore.eu/mock/image/2'
      const { queryByTestId, queryAllByTestId } = render(
        withAppContext(<AttachmentViewer {...props} href={href} />)
      )

      expect(
        queryAllByTestId('attachment-viewer-button-previous')
      ).toHaveLength(1)
      expect(queryAllByTestId('attachment-viewer-button-next')).toHaveLength(1)

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        href
      )
    })

    it('on page 3 it should render the correct image and only previous button', () => {
      const href = 'https://objectstore.eu/mock/image/3'
      const { queryByTestId, queryAllByTestId } = render(
        withAppContext(<AttachmentViewer {...props} href={href} />)
      )

      expect(
        queryAllByTestId('attachment-viewer-button-previous')
      ).toHaveLength(1)
      expect(queryAllByTestId('attachment-viewer-button-next')).toHaveLength(0)

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        href
      )
    })
  })

  describe('events', () => {
    it('should navigate on click', () => {
      const { getByTestId, queryByTestId } = render(
        withAppContext(
          <AttachmentViewer {...props} href={props.attachments[1].location} />
        )
      )

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[1].location
      )

      act(() => {
        fireEvent.click(getByTestId('attachment-viewer-button-previous'))
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[0].location
      )

      expect(
        queryByTestId('attachment-viewer-button-previous')
      ).not.toBeInTheDocument()

      act(() => {
        fireEvent.click(getByTestId('attachment-viewer-button-next'))
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[1].location
      )

      act(() => {
        fireEvent.click(getByTestId('attachment-viewer-button-next'))
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[2].location
      )

      act(() => {
        fireEvent.click(getByTestId('attachment-viewer-button-next'))
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[3].location
      )

      expect(
        queryByTestId('attachment-viewer-button-next')
      ).not.toBeInTheDocument()
    })

    it('should navigate on key press', () => {
      const { queryByTestId } = render(
        withAppContext(
          <AttachmentViewer {...props} href={props.attachments[1].location} />
        )
      )

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[1].location
      )

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowLeft', code: 37, keyCode: 37 })
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[0].location
      )

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowLeft', code: 37, keyCode: 37 })
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[0].location
      )

      act(() => {
        fireEvent.keyDown(document, {
          key: 'ArrowRight',
          code: 39,
          keyCode: 39,
        })
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[1].location
      )

      act(() => {
        fireEvent.keyDown(document, {
          key: 'ArrowRight',
          code: 39,
          keyCode: 39,
        })
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[2].location
      )

      act(() => {
        fireEvent.keyDown(document, {
          key: 'ArrowRight',
          code: 39,
          keyCode: 39,
        })
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[3].location
      )

      act(() => {
        fireEvent.keyDown(document, {
          key: 'ArrowRight',
          code: 39,
          keyCode: 39,
        })
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        props.attachments[3].location
      )
    })

    it('should not navigate on keypress ', () => {
      const { queryByTestId } = render(
        withAppContext(
          <AttachmentViewer {...props} href={props.attachments[1].location} />
        )
      )

      const initialSrc = props.attachments[1].location

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        initialSrc
      )

      act(() => {
        fireEvent.keyDown(document, { key: 'ArrowUp', code: 38, keyCode: 38 })
      })

      expect(queryByTestId('attachment-viewer-image')).toHaveAttribute(
        'src',
        initialSrc
      )
    })

    it('should close with close button', () => {
      const onClose = jest.fn()

      render(
        withAppContext(
          <AttachmentViewer
            {...props}
            href={props.attachments[0].location}
            onClose={onClose}
          />
        )
      )

      expect(onClose).not.toHaveBeenCalled()

      userEvent.click(screen.getByTitle(/sluiten/i))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should close with click outside', () => {
      const onClose = jest.fn()

      render(
        withAppContext(
          <AttachmentViewer
            {...props}
            href={props.attachments[0].location}
            onClose={onClose}
          />
        )
      )

      expect(onClose).not.toHaveBeenCalled()

      userEvent.click(screen.getByTestId('attachment-viewer-modal-wrapper'))

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('should show caption', () => {
    render(
      withAppContext(
        <AttachmentViewer {...props} href={props.attachments[1].location} />
      )
    )

    expect(screen.getByText('text shown')).toBeInTheDocument()
  })
})
