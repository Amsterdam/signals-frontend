import React from 'react';
import { render } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { store, withAppContext } from 'test/utils';
import incidentJson from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';
import { requestIncidentSuccess } from 'models/incident/actions';

import { IncidentSplitContainer } from './index';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

store.dispatch(requestIncidentSuccess(incidentJson));
store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

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
  it('should render correctly', async () => {
    const props = {
      onSplitIncident: jest.fn(),
      onGoBack: jest.fn(),
    };

    fetch.mockResponseOnce(JSON.stringify(incidentJson));

    const { queryByTestId, queryAllByTestId, findByTestId } = render(
      withAppContext(<IncidentSplitContainer {...props} />)
    );

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();

    await findByTestId('incidentSplit');

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();

    expect(queryAllByTestId('incidentPartTitle')[0]).toHaveTextContent(
      /^Deelmelding 1$/
    );
    expect(queryAllByTestId('incidentPartTitle')[1]).toHaveTextContent(
      /^Deelmelding 2$/
    );
  });
});
