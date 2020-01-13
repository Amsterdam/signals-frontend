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

      expect(queryByText('Uw (mobiele) telefoon')).toBeInTheDocument();
      expect(queryByText('0666 666 666')).toBeInTheDocument();
      expect(queryByText('Uw e-mailadres')).toBeInTheDocument();
      expect(queryByText('duvel@uiteendoosje.nl')).toBeInTheDocument();
    });

    it('expect to render correctly with invisible items', () => {
      const { queryByText } = render(
        withAppContext(<IncidentPreview {...props} />)
      );

      expect(queryByText('Uw (mobiele) telefoon')).not.toBeInTheDocument();
      expect(queryByText('0666 666 666')).not.toBeInTheDocument();
      expect(queryByText('Uw e-mailadres')).not.toBeInTheDocument();
      expect(queryByText('duvel@uiteendoosje.nl')).not.toBeInTheDocument();
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

    fireEvent.click(
      container.querySelector('button:nth-of-type(1)')
    );

    expect(push).toHaveBeenCalledWith('/incident/step1');
  });
});
