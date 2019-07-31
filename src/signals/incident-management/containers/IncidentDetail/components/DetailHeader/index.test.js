import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import DetailHeader from './index';

describe('<DetailHeader />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: { id: 42 },
      baseUrl: '/manage',
      accessToken: 'MOCK-TOKEN'
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      expect(10).toBe(10);
      const { queryByTestId } = withAppContext(
        <DetailHeader {...props} />
      );

      expect(queryByTestId('detail-header-title')).toHaveTextContent(/^Melding 42$/);
    });
  });
});
