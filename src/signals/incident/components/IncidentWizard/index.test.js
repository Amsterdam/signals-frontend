// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'
import * as auth from 'shared/services/auth/auth'
import incidentJson from 'utils/__tests__/fixtures/incident.json'

import AppContext from '../../../../containers/App/context'
import IncidentWizard from '.'

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}))
jest.mock('shared/services/configuration/configuration')
jest.spyOn(auth, 'getIsAuthenticated').mockImplementation(() => false)

const sources = [
  {
    key: 1,
    value: 'Source 1',
  },
  {
    key: 2,
    value: 'Source 2',
  },
]
const withContext = (Component, actualSources = null, loading = false) =>
  withAppContext(
    <AppContext.Provider value={{ sources: actualSources, loading }}>
      {Component}
    </AppContext.Provider>
  )

describe('<IncidentWizard />', () => {
  const props = {
    wizardDefinition: {},
    getClassification: jest.fn(),
    updateIncident: jest.fn(),
    addToSelection: jest.fn(),
    removeFromSelection: jest.fn(),
    createIncident: jest.fn(),
    removeQuestionData: jest.fn(),
    incidentContainer: {
      loading: false,
    },
  }

  afterEach(() => {
    configuration.__reset()
  })

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
    }

    const { queryByTestId } = render(
      withContext(<IncidentWizard {...propsWithForm} />)
    )

    expect(queryByTestId('incidentForm')).toBeInTheDocument()
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument()
  })

  it('should not render without any form or preview', () => {
    const propsWithout = {
      ...props,
      wizardDefinition: {
        beschrijf: {},
      },
    }

    const { queryByTestId } = render(
      withContext(<IncidentWizard {...propsWithout} />)
    )

    expect(queryByTestId('incidentForm')).not.toBeInTheDocument()
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument()
  })

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
    }

    const { queryByTestId } = render(
      withContext(<IncidentWizard {...propsWithFormFactory} />)
    )

    expect(queryByTestId('incidentForm')).toBeInTheDocument()
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument()
  })

  it('expect to render preview factory correctly', () => {
    const propsWithPreviewFactory = {
      ...props,
      wizardDefinition: {
        samenvatting: {
          sectionLabels: {
            heading: {
              samenvatting: 'Samenvatting',
            },
            edit: {
              samenvatting: 'Samenvatting wijzigen',
            },
          },
          previewFactory: () => ({
            controls: {},
          }),
        },
      },
    }

    const { queryByTestId } = render(
      withContext(
        <IncidentWizard
          {...propsWithPreviewFactory}
          incidentContainer={{ incident: incidentJson }}
        />
      )
    )

    expect(queryByTestId('incidentForm')).not.toBeInTheDocument()
    expect(queryByTestId('incidentPreview')).toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument()
  })

  it('expect to render loading correctly', () => {
    const propsWithPreview = {
      ...props,
      incidentContainer: {
        loading: true,
      },
    }

    const { queryByTestId } = render(
      withContext(<IncidentWizard {...propsWithPreview} />)
    )

    expect(queryByTestId('incidentForm')).not.toBeInTheDocument()
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).toBeInTheDocument()
  })

  it('should render loading when App loading', () => {
    const { queryByTestId } = render(
      withContext(<IncidentWizard {...props} />, null, true)
    )

    expect(queryByTestId('incidentForm')).not.toBeInTheDocument()
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).toBeInTheDocument()
  })

  it('should work without sources (not authorized)', () => {
    const propsWithForm = {
      ...props,
      wizardDefinition: {
        beschrijf: {
          form: {
            controls: {},
          },
        },
      },
    }
    const { queryByTestId } = render(
      withContext(<IncidentWizard {...propsWithForm} />)
    )

    expect(queryByTestId('incidentForm')).toBeInTheDocument()
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument()
  })

  it('should pass the sources to the formFactory', () => {
    const formFactory = jest.fn().mockImplementation(() => ({ controls: {} }))
    const incident = {}
    const propsWithFormFactory = {
      ...props,
      incidentContainer: {
        incident,
      },
      wizardDefinition: {
        beschrijf: {
          formFactory,
        },
      },
    }

    const { queryByTestId } = render(
      withContext(<IncidentWizard {...propsWithFormFactory} />, sources)
    )

    expect(queryByTestId('incidentForm')).toBeInTheDocument()
    expect(queryByTestId('incidentPreview')).not.toBeInTheDocument()
    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument()
    expect(formFactory).toHaveBeenCalledWith(incident, sources)
  })
})
