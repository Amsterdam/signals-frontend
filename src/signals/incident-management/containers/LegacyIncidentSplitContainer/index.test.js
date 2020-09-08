import React from 'react';
import { render } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { store, withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';

import { LegacyIncidentSplitContainer } from '.';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  id: '42',
}));

// mocking a deeply nested component to prevent having to mock
// multiple data providers and child components
jest.mock('../../components/FieldControlWrapper', () => ({
  __esModule: true,
  default: () => <span />,
}));

const attachments = {
  _links: {
    self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/999999/attachments' },
    next: { href: null },
    previous: { href: null },
  },
  count: 1,
  results: [
    {
      _display: 'Attachment object (980)',
      _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/999999/attachments' } },
      location: 'https://ae70d54aca324d0480ca01934240c78f.jpg',
      is_image: true,
      created_at: '2020-06-10T11:51:24.281272+02:00',
    },
  ],
};

describe('<LegacyIncidentSplitContainer />', () => {
  it('should render correctly', async () => {
    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }],
      [JSON.stringify(attachments), { status: 200 }]
    );

    const props = {
      onSplitIncident: jest.fn(),
      onGoBack: jest.fn(),
    };

    const { queryByTestId, queryAllByTestId, findByTestId } = render(
      withAppContext(<LegacyIncidentSplitContainer {...props} />)
    );

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();

    await findByTestId('incidentSplit');

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();

    expect(queryAllByTestId('splitDetailTitle')[0]).toBeInTheDocument();
    expect(queryAllByTestId('incidentPartTitle')[0]).toHaveTextContent(/^Deelmelding 1$/);
    expect(queryAllByTestId('incidentPartTitle')[1]).toHaveTextContent(/^Deelmelding 2$/);
  });
});
