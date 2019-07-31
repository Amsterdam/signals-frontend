import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import DetailHeader from './index';

jest.mock('./components/DownloadButton', () => () => 'DownloadButton');

describe('<DetailHeader />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: {
        id: 42,
        status: {
          state: 'm'
        },
        _links: {
          'sia:pdf': { href: 'https://api.data.amsterdam.nl/signals/v1/private/signals/3076/pdf' }
        }
      },
      baseUrl: '/manage',
      accessToken: 'MOCK-TOKEN',
      onThor: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      expect(10).toBe(10);
      const { queryByTestId } = render(
        withAppContext(<DetailHeader {...props} />)
      );

      expect(queryByTestId('detail-header-button-back')).toHaveTextContent(/^Terug naar overzicht$/);
      expect(queryByTestId('detail-header-title')).toHaveTextContent(/^Melding 42$/);
      expect(queryByTestId('detail-header-button-split')).toHaveTextContent(/^Splitsen$/);
      expect(queryByTestId('detail-header-button-thor')).toHaveTextContent(/^THOR$/);
      // expect(queryByTestId('detail-header-button-download')).toHaveTextContent(/^PDF$/);
    });
  });
});
