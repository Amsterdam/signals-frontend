import React from 'react';
import { render, cleanup } from '@testing-library/react';

import Detail from './index';

jest.mock('./components/Attachments', () => () => <div data-testid="detail-attachments" />);
jest.mock('./components/ExtraProperties', () => () => <div data-testid="detail-extra-properties" />);
jest.mock('../../components/Highlight', () => () => <div data-testid="detail-highlight" />);

describe('<Detail />', () => {
  const props = {
    incident: {
      text: 'het is een rotzooi weer',
      reporter: {
        email: 'steve@apple.com',
        phone: '098754321'
      },
      extra_properties: [{ extra_straatverlichting: {} }]
    },
    attachments: [],
    stadsdeelList: [],
    onShowLocation: jest.fn(),
    onEditLocation: jest.fn(),
    onShowAttachment: jest.fn()
  };

  afterEach(cleanup);

  it('should render correctly', () => {
    const { queryByTestId, queryAllByTestId } = render(
      <Detail {...props} />
    );

    expect(queryByTestId('detail-title')).toHaveTextContent(/^het is een rotzooi weer$/);

    expect(queryByTestId('detail-email-definition')).toHaveTextContent(/^E-mail melder$/);
    expect(queryByTestId('detail-email-value')).toHaveTextContent(/^steve@apple.com$/);
    expect(queryByTestId('detail-phone-definition')).toHaveTextContent(/^Telefoon melder$/);
    expect(queryByTestId('detail-phone-value')).toHaveTextContent(/^098754321$/);

    expect(queryAllByTestId('detail-attachments')).toHaveLength(1);
    expect(queryAllByTestId('detail-extra-properties')).toHaveLength(1);
    expect(queryAllByTestId('detail-attachments')).toHaveLength(1);
  });
});
