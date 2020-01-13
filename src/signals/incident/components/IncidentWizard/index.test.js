import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import IncidentWizard from './index';

describe.skip('<IncidentWizard />', () => {
  const props = {
    wizardDefinition: {},
    getClassification: jest.fn(),
    updateIncident: jest.fn(),
    createIncident: jest.fn(),
    incidentContainer: {
      loading: false,
    },
    isAuthenticated: false,
  };

  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('expect to render form correctly', () => {
    const propsWithForm = {
      ...props,
      wizardDefinition: {
        beschrijf: {
          form: {
            controls: {
              with_definition: {},
            },
          },
        },
      },
    }

    const { queryByTestId } = render(
      withAppContext(
        <IncidentWizard {...propsWithForm} />,
      ),
    );

    expect(queryByTestId('incidentForm')).toBeInTheDocument();
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument();
  });

  it('expect to render form factory correctly', () => {
    const propsWithFormFactory = {
      ...props,
      wizardDefinition: {
        beschrijf: {
          form: {
            controls: {
              with_definition: {},
            },
          },
        },
      },
    }

    const { queryByTestId } = render(
      withAppContext(
        <IncidentWizard {...propsWithFormFactory} />,
      ),
    );

    expect(queryByTestId('incidentForm')).toBeInTheDocument();
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument();
  });

  it('expect to render preview correctly', () => {
    const propsWithPreview = {
      ...props,
      wizardDefinition: {
        samenvatting: {
          preview: {},
        },
      },
    }

    const { queryByTestId } = render(
      withAppContext(
        <IncidentWizard {...propsWithPreview} />,
      ),
    );

    expect(queryByTestId('incidentForm')).not.toBeInTheDocument();
    expect(queryByTestId('incidentPreview')).toBeInTheDocument();
  });

  it('expect to render loading correctly', () => {
    const propsWithPreview = {
      ...props,
      incidentContainer: {
        loading: true,
      },
    }

    const { queryByTestId } = render(
      withAppContext(
        <IncidentWizard {...propsWithPreview} />,
      ),
    );

    expect(queryByTestId('incidentForm')).not.toBeInTheDocument();
    expect(queryByTestId('incidentPreview')).toBeInTheDocument();
  });
});
