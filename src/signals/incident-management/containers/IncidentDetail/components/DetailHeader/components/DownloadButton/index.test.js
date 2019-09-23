import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';

import DownloadButton from './index';

describe('<DownloadButton />', () => {
  let props;

  beforeEach(() => {
    props = {
      label: 'PDF',
      url: 'https://api.data.amsterdam.nl/signals/v1/private/signals/3077/pdf',
      filename: 'SIA melding 3077.pdf'
    };

    global.window.fetch = jest.fn();
    global.window.URL.createObjectURL = jest.fn();
    global.window.URL.revokeObjectURL = jest.fn();
  });

  afterEach(cleanup);

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId } = render(
        <DownloadButton {...props} />
      );

      expect(queryByTestId('download-button')).toHaveTextContent(/^PDF$/);
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

      global.window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should download document', () => {
      const { queryByTestId } = render(
        <DownloadButton {...props} />
      );
      fireEvent.click(queryByTestId('download-button'));

      expect(window.fetch).toHaveBeenCalledWith(props.url, {
        method: 'GET',
        headers: {},
        responseType: 'blob'
      });
    });

    it('should download document when logged in', () => {
      const { queryByTestId } = render(
        <DownloadButton {...props} accessToken="MOCK-TOKEN" />
        );
      fireEvent.click(queryByTestId('download-button'));

      expect(window.fetch).toHaveBeenCalledWith(props.url, {
        method: 'GET',
        headers: { Authorization: 'Bearer MOCK-TOKEN' },
        responseType: 'blob'
      });
    });
  });
});
