import React from 'react';
import { render } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { store, withAppContext } from 'test/utils';
import incidentJson from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';
import { requestIncidentSuccess } from 'models/incident/actions';
import makeSelectIncidentModel from 'models/incident/selectors';

import { IncidentSplitContainer } from './index';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

store.dispatch(requestIncidentSuccess(incidentJson));
store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

const incidentModel = makeSelectIncidentModel(store.getState());
jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  id: '42',
}));

// mocking a deeply nested component to prevent having to mock
// multiple data providers and child components
jest.mock('../../components/FieldControlWrapper', () => ({
  __esModule: true,
  default: () => (<span />),
}));

describe('<IncidentSplitContainer />', () => {
  it('should render correctly', () => {
    const props = {
      incidentModel,
      onRequestIncident: jest.fn(),
      onRequestAttachments: jest.fn(),
      onSplitIncident: jest.fn(),
      onGoBack: jest.fn(),
    };

    const { getByTestId, queryAllByTestId, rerender } = render(
      withAppContext(<IncidentSplitContainer {...props} incidentModel={{ ...incidentModel, loading: true }} />)
    );

    expect(getByTestId('loadingIndicator')).toBeInTheDocument();

    rerender(
      withAppContext(<IncidentSplitContainer {...props} />)
    );

    expect(queryAllByTestId('incidentPartTitle')[0]).toHaveTextContent(
      /^Deelmelding 1$/
    );
    expect(queryAllByTestId('incidentPartTitle')[1]).toHaveTextContent(
      /^Deelmelding 2$/
    );

    expect(props.onRequestIncident).toHaveBeenCalledWith('42');
    expect(props.onRequestAttachments).toHaveBeenCalledWith('42');
  });
});
