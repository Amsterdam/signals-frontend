import React from 'react';
import { render as reactRender, fireEvent } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import * as reactRedux from 'react-redux';

import configuration from 'shared/services/configuration/configuration';

import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import { subcategoriesWithUniqueKeys as subcategories } from 'utils/__tests__/fixtures';

import departmentsFixture from 'utils/__tests__/fixtures/departments.json';
import * as departmentsSelectors from 'models/departments/selectors';

import { INCIDENT_URL } from 'signals/incident-management/routes';

import { withAppContext } from 'test/utils';

import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_SUCCESS, VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

import * as modelSelectors from 'models/categories/selectors';

import IncidentSplitContainer from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}));

jest.mock('containers/App/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/selectors'),
}));

jest.mock('models/departments/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/departments/selectors'),
}));

const departments = {
  ...departmentsFixture,
  count: departmentsFixture.count,
  list: departmentsFixture.results,
  results: undefined,
};

const submittedFormData = {
  department: 'ASC',
  incidents: [
    {
      description: 'Foo bar',
      category_url:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
      priority: 'high',
      type: 'SIG',
    },
    {
      description: 'Bar baz',
      category_url:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/japanse-duizendknoop',
      priority: 'normal',
      type: 'REQ',
    },
    {
      description: 'Zork!!!1!',
      category_url:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
      priority: 'low',
      type: 'COM',
    },
  ],
};

const id = 999;

// render a component, await a rendered element and return the render result
const renderAwait = async (component, testIdToLookFor = 'incidentSplitContainer') => {
  const renderResult = reactRender(withAppContext(component));

  await renderResult.findByTestId(testIdToLookFor);

  return renderResult;
};

// eslint-disable-next-line
const Form = (formData = submittedFormData) => ({ onSubmit, ...props }) => {
  const handleSubmit = () => {
    onSubmit(formData);
  };

  // skip error log
  delete props.parentIncident; // eslint-disable-line no-param-reassign, react/prop-types

  return (
    <form onSubmit={handleSubmit} {...props}>
      <input type="submit" value="Submit" />
    </form>
  );
};

describe('signals/incident-management/containers/IncidentSplitContainer', () => {
  beforeEach(() => {
    dispatch.mockReset();
    push.mockReset();
    fetch.resetMocks();

    jest.spyOn(modelSelectors, 'makeSelectSubCategories').mockImplementation(() => subcategories);
    jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => departments);
    jest.spyOn(departmentsSelectors, 'makeSelectDirectingDepartments').mockImplementation(() => [departments.list[0]]);

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ id }));

    fetch.once(JSON.stringify(incidentFixture));
  });

  it('should render loading indicator', async () => {
    const { getByTestId, findByTestId, queryByTestId } = reactRender(
      withAppContext(<IncidentSplitContainer FormComponent={Form()} />)
    );

    expect(getByTestId('loadingIndicator')).toBeInTheDocument();

    await findByTestId('incidentSplitContainer');

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('should request incident data on mount', async () => {
    await renderAwait(<IncidentSplitContainer FormComponent={Form()} />);

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should render the form on successful fetch', async () => {
    const { queryByTestId } = await renderAwait(<IncidentSplitContainer FormComponent={Form()} />);

    expect(queryByTestId('incidentSplitForm')).toBeInTheDocument();
  });

  it('should POST the form data', async () => {
    const { container, findByTestId } = await renderAwait(<IncidentSplitContainer FormComponent={Form()} />);

    expect(fetch).toHaveBeenCalledTimes(1);

    // mocking global error handler, because jsdom will complain about unimplemented submit listener
    global.console.error = jest.fn();

    fireEvent.click(container.querySelector('input[type="submit"]'));

    global.console.error.mockRestore();

    await findByTestId('incidentSplitForm');

    expect(fetch).toHaveBeenCalledTimes(2);

    expect(fetch).toHaveBeenLastCalledWith(
      configuration.INCIDENT_PRIVATE_ENDPOINT,
      expect.objectContaining({ method: 'POST' })
    );

    const lastCall = fetch.mock.calls.pop();
    const lastCallBody = JSON.parse(lastCall.pop().body);

    const { stadsdeel, buurt_code, address, geometrie } = incidentFixture.location;

    const parentData = {
      attachments: incidentFixture.attachments,
      extra_properties: incidentFixture.extra_properties,
      incident_date_end: incidentFixture.incident_date_end,
      incident_date_start: incidentFixture.incident_date_start,
      location: { stadsdeel, buurt_code, address, geometrie },
      reporter: incidentFixture.reporter,
      source: incidentFixture.source,
      text_extra: incidentFixture.text_extra,
      parent: incidentFixture.id,
    };

    const expectedTransformedBecauseOfReasonsUnknownToManValues = submittedFormData.incidents.map(
      ({ subcategory, description, type, priority }) => ({
        category: { category_url: subcategory },
        priority: { priority },
        text: description,
        type: { code: type },
      })
    );

    lastCallBody.forEach((partialIncidentData, index) => {
      expect(partialIncidentData).toEqual(
        expect.objectContaining(expectedTransformedBecauseOfReasonsUnknownToManValues[index])
      );
      expect(partialIncidentData).toEqual(expect.objectContaining(parentData));
    });
  });

  it('should display a global notification on success', async () => {
    fetch.resetMocks();
    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }], // get
      [JSON.stringify({}), { status: 201 }], // post
      [JSON.stringify({}), { status: 201 }] // patch
    );
    const { container, findByTestId } = await renderAwait(
      <IncidentSplitContainer FormComponent={Form({ ...submittedFormData, department: null })} />
    );

    expect(dispatch).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    fireEvent.click(container.querySelector('input[type="submit"]'));

    await findByTestId('incidentSplitContainer');

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({
        title: 'De melding is succesvol gedeeld',
        variant: VARIANT_SUCCESS,
        type: TYPE_LOCAL,
      })
    );

    expect(push).toHaveBeenCalledWith(`${INCIDENT_URL}/${id}`);
  });

  it('should display a global notification on POST fail', async () => {
    fetch.resetMocks();
    fetch.once(JSON.stringify(incidentFixture)).mockReject(new Error('Whoops!!1!'));

    const { container, findByTestId } = await renderAwait(<IncidentSplitContainer FormComponent={Form()} />);

    expect(dispatch).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    fireEvent.click(container.querySelector('input[type="submit"]'));

    await findByTestId('incidentSplitForm');

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({
        title: 'De melding kon niet gedeeld worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );

    expect(push).toHaveBeenCalledWith(`${INCIDENT_URL}/${id}`);
  });

  it('should display a global notification on PATCH fail', async () => {
    fetch.resetMocks();
    fetch
      .mockResponses(
        [JSON.stringify(incidentFixture), { status: 200 }], // get
        [JSON.stringify({}), { status: 201 }] // post
      )
      .mockReject(new Error('Whoops!!1!'));

    const { container, findByTestId } = await renderAwait(<IncidentSplitContainer FormComponent={Form()} />);

    expect(dispatch).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    fireEvent.click(container.querySelector('input[type="submit"]'));

    await findByTestId('incidentSplitForm');

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({
        title: 'De melding is succesvol gedeeld',
        variant: VARIANT_SUCCESS,
        type: TYPE_LOCAL,
      })
    );

    expect(push).toHaveBeenCalledWith(`${INCIDENT_URL}/${id}`);
  });
});
