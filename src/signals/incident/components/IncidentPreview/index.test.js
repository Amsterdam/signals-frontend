import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as reactRouterDom from 'react-router-dom';

import PreviewComponents from './components';
import IncidentPreview from './index';
import isVisible from './services/is-visible';

jest.mock('./services/is-visible');

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({}),
}));

describe('<IncidentPreview />', () => {
  let props;

  beforeEach(() => {
    props = {
      incidentContainer: {
        incident: {
          phone: '0666 666 666',
          email: 'duvel@uiteendoosje.nl',
        },
      },
      preview: {
        step1: {
          phone: {
            label: 'Uw (mobiele) telefoon',
            render: PreviewComponents.PlainText,
          },
        },
        step2: {
          email: {
            label: 'Uw e-mailadres',
            render: PreviewComponents.PlainText,
          },
        },
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('expect to render correctly', () => {
      isVisible.mockImplementation(() => true);
      const { queryByText } = render(
        withAppContext(<IncidentPreview {...props} />)
      );

      expect(queryByText(props.incidentContainer.incident.phone)).toBeInTheDocument();
      expect(queryByText(props.preview.step1.phone.label)).toBeInTheDocument();
      expect(queryByText(props.incidentContainer.incident.email)).toBeInTheDocument();
      expect(queryByText(props.preview.step2.email.label)).toBeInTheDocument();
    });

    it('expect to render correctly with invisible items', () => {
      const { queryByText } = render(
        withAppContext(<IncidentPreview {...props} />)
      );

      expect(queryByText(props.incidentContainer.incident.phone)).not.toBeInTheDocument();
      expect(queryByText(props.preview.step1.phone.label)).not.toBeInTheDocument();
      expect(queryByText(props.incidentContainer.incident.email)).not.toBeInTheDocument();
      expect(queryByText(props.preview.step2.email.label)).not.toBeInTheDocument();
    });
  });

  it('should trigger new page when clicking button', () => {
    isVisible.mockImplementation(() => true);
    const push = jest.fn();
    jest
      .spyOn(reactRouterDom, 'useHistory')
      .mockImplementationOnce(() => ({ push }));

    const { container } = render(
      withAppContext(<IncidentPreview {...props} />)
    );
    expect(push).not.toHaveBeenCalled();

    fireEvent.click(
      container.querySelectorAll('button')[1]
    );

    expect(push).toHaveBeenCalledWith('/incident/step2');
  });

  describe('rendering of all value types', () => {
    const alTypesProps = {
      incidentContainer: {
        incident: {
          plain_text: 'Dit is een melding',
          objectValue: {
            id: 'horecabedrijf',
            label: 'Horecabedrijf, zoals een café, restaurant',
          },
          listObjectValue: [{
            id: 'uitgewaaierd_terras',
            label: 'Uitgewaaierd terras',
          }, {
            id: 'doorloop',
            label: 'Het terras belemmert de doorloop',
          }],
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
              coordinates: [
                4.899258613586427,
                52.36784357172409,
              ],
            },
          },
        },
      },
      preview: {
        step1: {
          plain_text: {
            label: 'Plain text',
            render: PreviewComponents.PlainText,
          },
          objectValue: {
            label: 'Object value',
            render: PreviewComponents.ObjectValue,
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

    it('expect to render correctly', () => {
      isVisible.mockImplementation(() => true);

      const { queryByText } = render(
        withAppContext(<IncidentPreview {...alTypesProps} />)
      );

      const incident = alTypesProps.incidentContainer.incident;
      const step = alTypesProps.preview.step1;

      expect(queryByText(step.plain_text.label))
        .toBeInTheDocument();
      expect(queryByText(incident.plain_text))
        .toBeInTheDocument();

      expect(queryByText(step.objectValue.label))
        .toBeInTheDocument();
      expect(queryByText(incident.objectValue.label))
        .toBeInTheDocument();

      expect(queryByText(step.listObjectValue.label))
        .toBeInTheDocument();
      expect(queryByText(incident.listObjectValue[0].label))
        .toBeInTheDocument();
      expect(queryByText(incident.listObjectValue[1].label))
        .toBeInTheDocument();

      expect(queryByText(step.datetime.label))
        .toBeInTheDocument();
      expect(queryByText(incident.datetime.label))
        .toBeInTheDocument();

      expect(queryByText(step.location.label))
        .toBeInTheDocument();
      expect(queryByText(incident.location.address_text)).toBeInTheDocument();;
    });
  });
});
