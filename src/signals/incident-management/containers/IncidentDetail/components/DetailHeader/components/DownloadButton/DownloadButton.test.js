// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, fireEvent, act, screen } from '@testing-library/react'

import DownloadButton from './DownloadButton'

// TODO: these tests broke when updating MSW, should be fixed
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<DownloadButton />', () => {
  let props

  beforeEach(() => {
    props = {
      label: 'PDF',
      url: 'https://api.data.amsterdam.nl/signals/v1/private/signals/3077/pdf',
      filename: 'SIA melding 3077.pdf',
    }

    global.window.URL.createObjectURL = jest.fn()
    global.window.URL.revokeObjectURL = jest.fn()
  })

  describe('rendering', () => {
    it('should render correctly', () => {
      render(<DownloadButton {...props} />)
      const downloadButton = screen.queryByTestId('download-button')

      expect(downloadButton).toHaveTextContent(/^PDF$/)
      expect(downloadButton.disabled).toEqual(false)
    })
  })

  describe('events', () => {
    beforeEach(() => {
      const res = new Response('{"hello":"world"}', {
        status: 200,
        headers: {
          'Content-type': 'application/blob',
        },
      })

      fetch.mockReturnValue(Promise.resolve(res))
    })

    it('should download document', async () => {
      render(<DownloadButton {...props} />)
      const downloadButton = screen.queryByTestId('download-button')

      // suppress console error because of unimplemented navigation in JSDOM
      // @see {@link https://github.com/jsdom/jsdom/issues/2112}
      global.window.console.error = jest.fn()

      act(() => {
        fireEvent.click(downloadButton)
      })

      global.window.console.error.mockRestore()

      expect(downloadButton.disabled).toEqual(true)

      expect(fetch).toHaveBeenCalledWith(
        props.url,
        expect.objectContaining({
          method: 'GET',
          responseType: 'blob',
        })
      )

      await screen.findByTestId('download-button')

      expect(downloadButton.disabled).toEqual(false)
    })

    it('should not trigger download when the filename is changed', async () => {
      const { rerender } = render(<DownloadButton {...props} />)
      const downloadButton = screen.queryByTestId('download-button')

      // suppress console error because of unimplemented navigation in JSDOM
      // @see {@link https://github.com/jsdom/jsdom/issues/2112}
      global.window.console.error = jest.fn()

      act(() => {
        fireEvent.click(downloadButton)
      })

      global.window.console.error.mockRestore()

      expect(downloadButton.disabled).toEqual(true)

      expect(fetch).toHaveBeenCalledWith(
        props.url,
        expect.objectContaining({
          method: 'GET',
          responseType: 'blob',
        })
      )

      fetch.mockReset()

      rerender(<DownloadButton {...props} filename="SIA melding 3076.pdf" />)
      await screen.findByTestId('download-button')

      expect(fetch).not.toHaveBeenCalled()
    })

    it('should handle IE', async () => {
      global.window.navigator.msSaveOrOpenBlob = jest.fn()

      render(<DownloadButton {...props} />)
      const downloadButton = screen.getByTestId('download-button')

      expect(global.window.navigator.msSaveOrOpenBlob).not.toHaveBeenCalled()

      act(() => {
        fireEvent.click(downloadButton)
      })

      await screen.findByTestId('download-button')

      expect(global.window.navigator.msSaveOrOpenBlob).toHaveBeenCalled()
    })
  })
})
