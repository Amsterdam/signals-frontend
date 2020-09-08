import React from 'react';
import { render as reactRender, act, fireEvent } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import * as reactRedux from 'react-redux';

import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import configuration from 'shared/services/configuration/configuration';
import { withAppContext } from 'test/utils';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_SUCCESS, VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';
import { INCIDENT_URL } from 'signals/incident-management/routes';

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

const formSubmissionValues = [
  {
    text: 'Foo bar',
    category: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
    priority: 'high',
    type: 'SIG',
  },
  {
    text: 'Bar baz',
    category:
      'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/japanse-duizendknoop',
    priority: 'normal',
    type: 'REQ',
  },
  {
    text: 'Zork!!!1!',
    category: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
    priority: 'low',
    type: 'COM',
  },
];

const id = 999;

// render a component, await a rendered element and return the render result
const renderAwait = async (component, testIdToLookFor = 'incidentSplitContainer') => {
  const renderResult = reactRender(withAppContext(component));

  await renderResult.findByTestId(testIdToLookFor);

  return renderResult;
};

// eslint-disable-next-line
const Form = ({ onSubmit, ...props }) => {
  const handleSubmit = () => {
    onSubmit(formSubmissionValues);
  };

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

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      id,
    }));

    fetch.once(JSON.stringify(incidentFixture));
  });

  it('should render loading indicator', async () => {
    const { getByTestId, findByTestId, queryByTestId } = reactRender(
      withAppContext(<IncidentSplitContainer FormComponent={Form} />)
    );

    expect(getByTestId('loadingIndicator')).toBeInTheDocument();

    await findByTestId('incidentSplitContainer');

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('should request incident data on mount', async () => {
    await renderAwait(<IncidentSplitContainer FormComponent={Form} />);

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should render the form on successful fetch', async () => {
    const { queryByTestId } = await renderAwait(<IncidentSplitContainer FormComponent={Form} />);

    expect(queryByTestId('incidentSplitForm')).toBeInTheDocument();
  });

  it('should POST the form data', async () => {
    const { container, findByTestId } = await renderAwait(<IncidentSplitContainer FormComponent={Form} />);

    expect(fetch).toHaveBeenCalledTimes(1);

    // mocking global error handler, because jsdom will complain about unimplemented submit listener
    global.console.error = jest.fn();

    act(() => {
      fireEvent.click(container.querySelector('input[type="submit"]'));
    });

    global.console.error.mockRestore();

    await findByTestId('incidentSplitForm');

    expect(fetch).toHaveBeenCalledTimes(2);

    expect(fetch).toHaveBeenLastCalledWith(
      configuration.INCIDENT_PRIVATE_ENDPOINT,
      expect.objectContaining({ method: 'POST' })
    );

    const lastCall = fetch.mock.calls.pop();
    const lastCallBody = JSON.parse(lastCall.pop().body);

    const parentData = {
      extra_properties: incidentFixture.extra_properties,
      incident_date_end: incidentFixture.incident_date_end,
      incident_date_start: incidentFixture.incident_date_start,
      location: incidentFixture.location,
      reporter: incidentFixture.reporter,
      source: incidentFixture.source,
      text_extra: incidentFixture.text_extra,
    };

    lastCallBody.forEach((partialIncidentData, index) => {
      expect(partialIncidentData).toEqual(expect.objectContaining(formSubmissionValues[index]));
      expect(partialIncidentData).toEqual(expect.objectContaining(parentData));
    });
  });

  it('should display a global notification on POST success', async () => {
    fetch.resetMocks();
    fetch.once(JSON.stringify(incidentFixture)).once(JSON.stringify(incidentFixture));

    const { container, findByTestId } = await renderAwait(<IncidentSplitContainer FormComponent={Form} />);

    expect(dispatch).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(container.querySelector('input[type="submit"]'));
    });

    await findByTestId('incidentSplitForm');

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({
        title: 'De melding is succesvol gesplitst',
        variant: VARIANT_SUCCESS,
        type: TYPE_LOCAL,
      })
    );
    expect(push).toHaveBeenCalledWith(`${INCIDENT_URL}/${id}`);
  });

  it('should display a global notification on POST fail', async() => {
    fetch.resetMocks();
    fetch.once(JSON.stringify(incidentFixture)).mockReject(new Error('Whoops!!1!'));

    const { container, findByTestId } = await renderAwait(<IncidentSplitContainer FormComponent={Form} />);

    expect(dispatch).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(container.querySelector('input[type="submit"]'));
    });

    await findByTestId('incidentSplitForm');

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({
        title: 'De melding kon niet gesplitst worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );
    expect(push).toHaveBeenCalledWith(`${INCIDENT_URL}/${id}`);
  });
});
