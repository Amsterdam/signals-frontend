import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as auth from 'shared/services/auth/auth';
import incidentJson from 'utils/__tests__/fixtures/incident.json';

import IncidentWizard from '.';

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}));

jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

describe('<IncidentWizard />', () => {
  const props = {
    wizardDefinition: {},
    getClassification: jest.fn(),
    updateIncident: jest.fn(),
    createIncident: jest.fn(),
    incidentContainer: {
      loading: false,
    },
  };

  it('expect to render form correctly', () => {
    const propsWithForm = {
      ...props,
      wizardDefinition: {
        beschrijf: {
          form: {
            controls: {},
          },
        },
      },
    };

    const { queryByTestId } = render(
      withAppContext(
        <IncidentWizard {...propsWithForm} />,
      ),
    );

    expect(queryByTestId('incidentForm')).toBeInTheDocument();
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('expect to render form factory correctly', () => {
    const propsWithFormFactory = {
      ...props,
      wizardDefinition: {
        beschrijf: {
          formFactory: () => ({
            controls: {},
          }),
        },
      },
    };

    const { queryByTestId } = render(
      withAppContext(
        <IncidentWizard {...propsWithFormFactory} />,
      ),
    );

    expect(queryByTestId('incidentForm')).toBeInTheDocument();
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('expect to render preview correctly', () => {
    const propsWithPreview = {
      ...props,
      wizardDefinition: {
        samenvatting: {
          preview: {},
        },
      },
    };

    const { queryByTestId } = render(
      withAppContext(
        <IncidentWizard {...propsWithPreview} incidentContainer={{ incident: incidentJson }} />,
      ),
    );

    expect(queryByTestId('incidentForm')).not.toBeInTheDocument();
    expect(queryByTestId('incidentPreview')).toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('expect to render loading correctly', () => {
    const propsWithPreview = {
      ...props,
      incidentContainer: {
        loading: true,
      },
    };

    const { queryByTestId } = render(
      withAppContext(
        <IncidentWizard {...propsWithPreview} />,
      ),
    );

    expect(queryByTestId('incidentForm')).not.toBeInTheDocument();
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument();
    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
  });
});
