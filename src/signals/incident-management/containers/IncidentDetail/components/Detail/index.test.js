import React from 'react';
import { render, cleanup } from '@testing-library/react';
import incidentJSON from 'utils/__tests__/fixtures/incident.json';

import Detail from './index';

jest.mock('./components/Location', () => () => <div data-testid="detail-location" />);

describe('<Detail />', () => {
  const props = {
    incident: incidentJSON,
    attachments: [],
    stadsdeelList: [],
    onShowLocation: jest.fn(),
    onEditLocation: jest.fn(),
    onShowAttachment: jest.fn(),
  };

  afterEach(cleanup);

  it('should render correctly', () => {
    const { queryByTestId } = render(<Detail {...props} />);

    expect(queryByTestId('detail-title')).toHaveTextContent(incidentJSON.text);

    expect(queryByTestId('detail-email-definition')).toHaveTextContent(/^E-mail melder$/);
    expect(queryByTestId('detail-email-value')).toHaveTextContent(incidentJSON.reporter.email);
    expect(queryByTestId('detail-phone-definition')).toHaveTextContent(/^Telefoon melder$/);
    expect(queryByTestId('detail-phone-value')).toHaveTextContent(incidentJSON.reporter.phone);

    expect(queryByTestId('detail-extra-properties')).toBeInTheDocument();
    expect(queryByTestId('detail-attachments')).toBeInTheDocument();
    expect(queryByTestId('detail-location')).toBeInTheDocument();
  });
});
