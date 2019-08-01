import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import DetailHeader from './index';

jest.mock('./components/DownloadButton', () => () => <div data-testid="detail-header-button-download" />);

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
    it('should render all buttons when state is gemeld and no parent or children are present', () => {
      const { queryByTestId } = render(
        withAppContext(<DetailHeader {...props} />)
      );

      expect(queryByTestId('detail-header-button-back')).toHaveTextContent(/^Terug naar overzicht$/);
      expect(queryByTestId('detail-header-title')).toHaveTextContent(/^Melding 42$/);
      expect(queryByTestId('detail-header-button-split')).toHaveTextContent(/^Splitsen$/);
      expect(queryByTestId('detail-header-button-thor')).toHaveTextContent(/^THOR$/);
      expect(queryByTestId('detail-header-button-download')).not.toBeNull();
    });

    it('should render no split button when children are present', () => {
      props.incident._links['sia:children'] = [{ mock: 'child' }];
      const { queryByTestId } = render(
        withAppContext(<DetailHeader {...props} />)
      );

      expect(queryByTestId('detail-header-button-split')).toBeNull();
    });

    it('should render no split button when parent is present', () => {
      props.incident._links['sia:parent'] = { mock: 'parent' };
      const { queryByTestId } = render(
        withAppContext(<DetailHeader {...props} />)
      );

      expect(queryByTestId('detail-header-button-split')).toBeNull();
    });

    it('should render no split button when state is not m', () => {
      props.incident.status.state = 'o';
      const { queryByTestId } = render(
        withAppContext(<DetailHeader {...props} />)
      );

      expect(queryByTestId('detail-header-button-split')).toBeNull();
    });


    it('should render no thor button when state is not m, i, b, h, send failed or reopened', () => {
      props.incident.status.state = 'o';
      const { queryByTestId } = render(
        withAppContext(<DetailHeader {...props} />)
      );

      expect(queryByTestId('detail-header-button-thor')).toBeNull();
    });
  });
});
