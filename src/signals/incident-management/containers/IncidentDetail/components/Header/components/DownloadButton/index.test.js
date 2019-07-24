import React from 'react';
import { shallow } from 'enzyme';

import DownloadButton from './index';

describe('<DownloadButton />', () => {
  let props;

  beforeEach(() => {
    const mockFetchPromise = new Promise((resolve) => resolve({
      blob: () => new Blob()
    }));

    props = {
      label: 'PDF',
      url: 'zzz',
      filename: '12345.pdf'
    };
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    global.window.URL.createObjectURL = jest.fn().mockImplementation(() => 'blob-href');
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <DownloadButton {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly when logged in', () => {
      props.accessToken = 'access-token';
      const wrapper = shallow(
        <DownloadButton {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
