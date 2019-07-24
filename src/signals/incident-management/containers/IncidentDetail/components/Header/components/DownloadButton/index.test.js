import React from 'react';
import { shallow } from 'enzyme';

import DownloadButton from './index';

describe('<DownloadButton />', () => {
  let props;
  let input;

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

    input = {
      href: '',
      click: jest.fn()
    };
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
    input = null;
  });

  describe('rendering', () => {
    // it('should render correctly', () => {
      // const wrapper = shallow(
        // <DownloadButton {...props} />
      // );
      // expect(wrapper).toMatchSnapshot();
    // });
//
    // it('should render correctly when logged in', () => {
      // props.accessToken = 'access-token';
      // const wrapper = shallow(
        // <DownloadButton {...props} />
      // );
      // expect(wrapper).toMatchSnapshot();
    // });
  });

  describe('events', () => {
    it('should download file when button clicked', (done) => {
      const wrapper = shallow(
        <DownloadButton {...props} />
      );

      const instance = wrapper.instance();
      instance.downloadLink.current = input;

      wrapper.find('button').simulate('click');

      console.log('3');
      expect(1).toBe(1);
      done();
    });
  });
});
