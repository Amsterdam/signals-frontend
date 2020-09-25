import React from 'react';
import { render } from '@testing-library/react';

import { isAuthenticated } from 'shared/services/auth/auth';
import { withAppContext } from 'test/utils';

import PreviewComponents from './components';
import IncidentPreview from '.';

jest.mock('shared/services/auth/auth');

describe('<IncidentPreview />', () => {
  let props;

  beforeEach(() => {
    isAuthenticated.mockImplementation(() => false);

    props = {
      incident: {
        phone: '0666 666 666',
        email: 'duvel@uiteendoosje.nl',
        other_prop: 'Lorem ipsum',
      },
      preview: {
        beschrijf: {
          phone: {
            label: 'Uw (mobiele) telefoon',
            render: ({ value }) => value,
          },
          other_prop: {
            label: 'Foo bar',
            authenticated: true,
            render: ({ value }) => value,
          },
          optional_prop: {
            label: 'Bazzzz',
            optional: true,
            render: ({ value }) => value,
          },
          required_prop: {
            label: 'Qux',
            render: ({ value }) => value,
          },
        },
        vulaan: {
          email: {
            label: 'Uw e-mailadres',
            render: ({ value }) => value,
          },
        },
        some_other_section: {
          field: {
            label: 'Bar baz qux',
            render: ({ value }) => value,
          },
        },
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('expect to render correctly', async () => {
      const { queryByText, findByTestId } = render(withAppContext(<IncidentPreview {...props} />));

      await findByTestId('incidentPreview');

      expect(queryByText(props.incident.phone)).toBeInTheDocument();
      expect(queryByText(props.preview.beschrijf.phone.label)).toBeInTheDocument();

      expect(queryByText(props.incident.email)).toBeInTheDocument();
      expect(queryByText(props.preview.vulaan.email.label)).toBeInTheDocument();

      expect(queryByText(props.incident.other_prop)).not.toBeInTheDocument();
      expect(queryByText(props.preview.beschrijf.other_prop.label)).not.toBeInTheDocument();

      // optional prop without value should not be in the DOM
      expect(queryByText(props.preview.beschrijf.optional_prop.label)).not.toBeInTheDocument();

      // required prop without value should be in the DOM
      expect(queryByText(props.preview.beschrijf.required_prop.label)).toBeInTheDocument();
    });

    it('expect to render correctly for authenticated users', async () => {
      isAuthenticated.mockImplementation(() => true);

      const { queryByText, findByTestId } = render(withAppContext(<IncidentPreview {...props} />));

      await findByTestId('incidentPreview');

      expect(queryByText(props.incident.other_prop)).toBeInTheDocument();
      expect(queryByText(props.preview.beschrijf.other_prop.label)).toBeInTheDocument();
    });
  });

  it('should have links', async () => {
    const { container, findByTestId } = render(withAppContext(<IncidentPreview {...props} />));

    await findByTestId('incidentPreview');

    const sectionRe = new RegExp(Object.keys(props.preview).join('|'));
    container.querySelectorAll('a').forEach(element => {
      expect(element.href).toEqual(expect.stringMatching(sectionRe));
    });
  });

  it('should have the correct layout for authenticated users', async () => {
    isAuthenticated.mockImplementation(() => false);

    const { container, findByTestId, rerender } = render(withAppContext(<IncidentPreview {...props} />));

    await findByTestId('incidentPreview');

    container.querySelectorAll('header').forEach(element => {
      expect(element).toHaveStyleRule('grid-template-columns', '10fr 2fr');
    });

    isAuthenticated.mockImplementation(() => true);

    rerender(withAppContext(<IncidentPreview {...props} />));

    await findByTestId('incidentPreview');

    container.querySelectorAll('header').forEach(element => {
      expect(element).toHaveStyleRule('grid-template-columns', '4fr 6fr 2fr', {
        media: '(min-width:1024px)',
      });
    });
  });

  describe('rendering of all value types', () => {
    const alTypesProps = {
      incident: {
        plain_text: 'Dit is een melding',
        objectValue: {
          id: 'horecabedrijf',
          label: 'Horecabedrijf, zoals een café, restaurant',
        },
        listObjectValue: [
          {
            id: 'uitgewaaierd_terras',
            label: 'Uitgewaaierd terras',
          },
          {
            id: 'doorloop',
            label: 'Het terras belemmert de doorloop',
          },
        ],
        datetime: {
          id: 'Nu',
          label: 'Nu',
        },
        location: {
          address: {
            openbare_ruimte: 'Zwanenburgwal',
            huisnummer: '15',
            huisletter: '',
            huisnummer_toevoeging: '',
            postcode: '1011VW',
            woonplaats: 'Amsterdam',
          },
          address_text: 'Zwanenburgwal 15, 1011VW Amsterdam',
          buurt_code: 'A04i',
          stadsdeel: 'A',
          geometrie: {
            type: 'Point',
            coordinates: [4.899258613586427, 52.36784357172409],
          },
        },
      },
      preview: {
        beschrijf: {
          plain_text: {
            label: 'Plain text',
            render: ({ value }) => value,
          },
          objectValue: {
            label: 'Object value',
            render: ({ value }) => value.label,
          },
          listObjectValue: {
            label: 'List object value',
            render: PreviewComponents.ListObjectValue,
          },
          datetime: {
            label: 'Tijdstip',
            render: PreviewComponents.DateTime,
          },
          location: {
            label: 'Locatie',
            render: PreviewComponents.Map,
          },
        },
      },
    };

    it('expect to render correctly', async () => {
      const { queryByText, findByTestId } = render(withAppContext(<IncidentPreview {...alTypesProps} />));

      await findByTestId('incidentPreview');

      const { incident } = alTypesProps;
      const step = alTypesProps.preview.beschrijf;

      expect(queryByText(step.plain_text.label)).toBeInTheDocument();
      expect(queryByText(incident.plain_text)).toBeInTheDocument();

      expect(queryByText(step.objectValue.label)).toBeInTheDocument();
      expect(queryByText(incident.objectValue.label)).toBeInTheDocument();

      expect(queryByText(incident.listObjectValue[0].label)).toBeInTheDocument();
      expect(queryByText(incident.listObjectValue[1].label)).toBeInTheDocument();

      expect(queryByText(incident.datetime.label)).toBeInTheDocument();
      expect(queryByText(incident.location.address_text)).toBeInTheDocument();
    });
  });
});
