import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import Detail from '.';

describe('<Detail />', () => {
  const props = {
    incident: {
      text: 'het is een rotzooi weer',
      reporter: {
        email: 'steve@apple.com',
        phone: '098754321',
        sharing_allowed: true,
      },
      location: {
        address: {
          postcode: '',
          huisletter: 'D',
          huisnummer: 342,
          woonplaats: 'Amsterdam',
          openbare_ruimte: 'Marnixstraat',
          huisnummer_toevoeging: '',
        },
      },
      extra_properties: [
        {
          id: 'extra_bedrijven_horeca_wat',
          label: 'Soort bedrijf',
          answer: { id: 'evenement_festival_markt', label: 'Evenement, zoals een festival, feest of markt' },
          category_url: '',
        },
        {
          id: 'extra_bedrijven_horeca_naam',
          label: 'Mogelijke veroorzaker',
          answer: 'Muzikanten met hun trommels',
          category_url: '',
        },
      ],
      incident_date_start: '2020-02-06T08:50:15+01:00',
    },
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

  it('should render correctly', () => {
    const { queryByTestId, getByText } = render(withAppContext(<Detail {...props} />));

    expect(queryByTestId('detail-title')).toHaveTextContent(props.incident.text);

    expect(queryByTestId('detail-email-definition')).toHaveTextContent(/^E-mail melder$/);
    expect(queryByTestId('detail-email-value')).toHaveTextContent(props.incident.reporter.email);
    expect(queryByTestId('detail-phone-definition')).toHaveTextContent(/^Telefoon melder$/);
    expect(queryByTestId('detail-phone-value')).toHaveTextContent(props.incident.reporter.phone);
    expect(queryByTestId('detail-sharing-definition')).toHaveTextContent('Toestemming contactgegevens delen');
    expect(queryByTestId('detail-sharing-value')).toHaveTextContent('Ja');

    expect(getByText(props.incident.extra_properties[0].label)).toBeInTheDocument();
    expect(getByText(props.incident.extra_properties[1].label)).toBeInTheDocument();
    expect(queryByTestId('attachmentsDefinition')).toBeInTheDocument();
    expect(queryByTestId('detail-location')).toBeInTheDocument();
  });
});
