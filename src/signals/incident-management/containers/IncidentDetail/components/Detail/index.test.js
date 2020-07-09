import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';

import IncidentDetailContext from '../../context';
import Detail from './index';

describe('<Detail />', () => {
  const props = {
    attachments: [
      {
        _display: 'Attachment object (946)',
        _links: { self: { href: '/signals/4935/attachments' } },
        location: '/winther-viking-fiets-47400-2701016038.jpg',
        is_image: true,
        created_at: '2020-03-31T12:10:18.367047+02:00',
      },
      {
        _display: 'Attachment object (947)',
        _links: { self: { href: '/signals/4935/attachments' } },
        location: '/red-and-multicolored-abstract-painting-3577981.jpg',
        is_image: true,
        created_at: '2020-03-31T12:10:18.583548+02:00',
      },
    ],
    onShowLocation: jest.fn(),
    onEditLocation: jest.fn(),
    onShowAttachment: jest.fn(),
  };

  it('should render correctly', async () => {
    const { getByTestId, getByText, findByTestId } = render(
      withAppContext(
        <IncidentDetailContext.Provider value={{ incident: incidentFixture }}>
          <Detail {...props} />
        </IncidentDetailContext.Provider>
      )
    );

    await findByTestId('detail-title');

    expect(getByTestId('detail-title')).toHaveTextContent(incidentFixture.text);

    expect(getByTestId('detail-email-definition')).toHaveTextContent(/^E-mail melder$/);
    expect(getByTestId('detail-email-value')).toHaveTextContent(incidentFixture.reporter.email);
    expect(getByTestId('detail-phone-definition')).toHaveTextContent(/^Telefoon melder$/);
    expect(getByTestId('detail-phone-value')).toHaveTextContent(incidentFixture.reporter.phone);
    expect(getByTestId('detail-sharing-definition')).toHaveTextContent('Toestemming contactgegevens delen');
    expect(getByTestId('detail-sharing-value')).toHaveTextContent('Nee');

    expect(getByText(incidentFixture.extra_properties[0].label)).toBeInTheDocument();
    expect(getByText(incidentFixture.extra_properties[1].label)).toBeInTheDocument();
    expect(getByTestId('attachmentsDefinition')).toBeInTheDocument();
    expect(getByTestId('detail-location')).toBeInTheDocument();
  });
});
