import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import DownloadButton from './index';

describe('<DownloadButton />', () => {
  let props;

  beforeEach(() => {
    props = {
      label: 'PDF',
      url: 'https://api.data.amsterdam.nl/signals/v1/private/signals/3077/pdf',
      filename: 'SIA melding 3077.pdf',
    };

    global.window.URL.createObjectURL = jest.fn();
    global.window.URL.revokeObjectURL = jest.fn();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId } = render(<DownloadButton {...props} />);
      const downloadButton = queryByTestId('download-button');

      expect(downloadButton).toHaveTextContent(/^PDF$/);
      expect(downloadButton.disabled).toEqual(false);
    });
  });

  describe('events', () => {
    beforeEach(() => {
      const res = new Response('{"hello":"world"}', {
        status: 200,
        headers: {
          'Content-type': 'application/blob',
        },
      });

      fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should download document', async () => {
      const { queryByTestId, findByTestId } = render(<DownloadButton {...props} />);
      const downloadButton = queryByTestId('download-button');

      // suppress console error because of unimplemented navigation in JSDOM
      // @see {@link https://github.com/jsdom/jsdom/issues/2112}
      global.window.console.error = jest.fn();

      act(() => {
        fireEvent.click(downloadButton);
      });

      global.window.console.error.mockRestore();

      expect(downloadButton.disabled).toEqual(true);

      expect(fetch).toHaveBeenCalledWith(
        props.url,
        expect.objectContaining({
          method: 'GET',
          responseType: 'blob',
        })
      );

      await findByTestId('download-button');

      expect(downloadButton.disabled).toEqual(false);
    });

    it('should handle IE', async () => {
      global.window.navigator.msSaveOrOpenBlob = jest.fn();

      const { getByTestId, findByTestId } = render(<DownloadButton {...props} />);
      const downloadButton = getByTestId('download-button');

      expect(global.window.navigator.msSaveOrOpenBlob).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(downloadButton);
      });

      await findByTestId('download-button');

      expect(global.window.navigator.msSaveOrOpenBlob).toHaveBeenCalled();
    });
  });
});
