import React from 'react';
import { act } from 'react-dom/test-utils';
import { withAppContext } from 'test/utils';
import { fireEvent, render } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';

import configuration from 'shared/services/configuration/configuration';

import routes from 'signals/settings/routes';

import userFixture from 'utils/__tests__/fixtures/user.json';
import historyFixture from 'utils/__tests__/fixtures/history.json';
import rolesFixture from 'utils/__tests__/fixtures/roles.json';
import { departments } from 'utils/__tests__/fixtures';
import inputCheckboxRolesSelectorJson from 'utils/__tests__/fixtures/inputCheckboxRolesSelector.json';

import * as rolesSelectors from 'models/roles/selectors';
import * as modelSelectors from 'models/departments/selectors';
import * as appSelectors from 'containers/App/selectors';

import UserDetail from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('containers/App/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/selectors'),
}));

const push = jest.fn();

jest.mock('models/departments/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/departments/selectors'),
}));

jest.mock('models/roles/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/roles/selectors'),
}));

jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => departments);

jest.spyOn(rolesSelectors, 'inputCheckboxRolesSelector').mockImplementation(() => inputCheckboxRolesSelectorJson);

jest.spyOn(rolesSelectors, 'rolesModelSelector').mockImplementation(() => ({ list: rolesFixture }));

const userId = userFixture.id;

describe('signals/settings/users/containers/Detail', () => {
  beforeEach(() => {
    jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({ push }));
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => true);
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: userFixture.id }));

    fetch.mockResponseOnce(JSON.stringify(userFixture)).mockResponseOnce(JSON.stringify(historyFixture));
  });

  afterEach(() => {
    fetch.resetMocks();
    push.mockReset();
  });

  it('should render a backlink', async () => {
    const referrer = '/some-page-we-came-from';
    const { findByTestId, getByTestId, rerender, unmount } = render(withAppContext(<UserDetail />));

    const backlink = await findByTestId('backlink');

    expect(backlink.getAttribute('href')).toEqual(routes.users);

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({ referrer }));

    unmount();

    rerender(withAppContext(<UserDetail />));

    await findByTestId('backlink');

    expect(getByTestId('backlink').closest('a').getAttribute('href')).toEqual(referrer);
  });

  it('should render the correct title', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: undefined }));

    const { findByText, rerender, unmount } = render(withAppContext(<UserDetail />));

    const addTitle = await findByText('Gebruiker toevoegen');

    expect(addTitle).toBeInTheDocument();

    unmount();

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId }));

    rerender(withAppContext(<UserDetail />));

    const editTitle = await findByText('Gebruiker wijzigen');

    expect(editTitle).toBeInTheDocument();
  });

  it('should get user and history data', async () => {
    const { findByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    expect(fetch).toHaveBeenCalledTimes(2);

    const [url, params] = fetch.mock.calls[0];
    expect(url).toEqual(`${configuration.USERS_ENDPOINT}${userId}`);
    expect(params).toEqual(expect.objectContaining({ method: 'GET' }));

    const [historyUrl, historyParams] = fetch.mock.calls[1];
    expect(historyUrl).toEqual(`${configuration.USERS_ENDPOINT}${userId}/history`);
    expect(historyParams).toEqual(expect.objectContaining({ method: 'GET' }));
  });

  it('should render a loading indicator', async () => {
    const { findByTestId, getByTestId, queryByTestId } = render(withAppContext(<UserDetail />));

    expect(getByTestId('loadingIndicator')).toBeInTheDocument();

    await findByTestId('userDetailFormContainer');

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('should not render a form when the data from the API is not yet available', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId }));

    const { findByTestId, queryByTestId } = render(withAppContext(<UserDetail />));

    expect(queryByTestId('detailUserForm')).not.toBeInTheDocument();

    await findByTestId('userDetailFormContainer');

    expect(queryByTestId('detailUserForm')).toBeInTheDocument();
  });

  it('should render a form when the URL does not contain a user ID', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: undefined }));

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    expect(getByTestId('detailUserForm')).toBeInTheDocument();
  });

  it('should not patch user data on submit when form data has not been altered', async () => {
    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );

    act(() => {
      fireEvent.click(getByTestId('detailUserForm').querySelector('[type="submit"]'));
    });

    await findByTestId('userDetailFormContainer');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('should patch user data on submit', async () => {
    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );

    act(() => {
      const lastNameInput = getByTestId('detailUserForm').querySelector('#last_name');
      fireEvent.change(lastNameInput, { target: { value: 'Foo Bar Baz' } });
    });

    await findByTestId('userDetailFormContainer');

    act(() => {
      fireEvent.click(getByTestId('detailUserForm').querySelector('[type="submit"]'));
    });

    await findByTestId('userDetailFormContainer');

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('should NOT patch user data on submit when user does not have permissions', async () => {
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => false);

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );

    act(() => {
      fireEvent.change(getByTestId('detailUserForm').querySelector('#last_name'), { target: { value: 'Foo Bar Baz' } });
    });

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );

    act(() => {
      fireEvent.submit(document.forms[0]);
    });

    await findByTestId('userDetailFormContainer');

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('should post user data on submit', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: undefined }));

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    const lastName = 'Foo Bar Baz';
    act(() => {
      fireEvent.change(getByTestId('detailUserForm').querySelector('#last_name'), { target: { value: lastName } });
    });

    const firstName = 'Zork';
    act(() => {
      fireEvent.change(getByTestId('detailUserForm').querySelector('#first_name'), { target: { value: firstName } });
    });

    const username = 'zork@foobarbaz.com';
    act(() => {
      fireEvent.change(getByTestId('detailUserForm').querySelector('#username'), {
        target: { value: username },
      });
    });

    expect(fetch).not.toHaveBeenCalledWith(configuration.USERS_ENDPOINT, expect.objectContaining({ method: 'POST' }));

    act(() => {
      fireEvent.click(getByTestId('detailUserForm').querySelector('[type="submit"]'));
    });

    await findByTestId('userDetailFormContainer');

    const [url, params] = fetch.mock.calls[0];
    const body = JSON.parse(params.body);
    expect(url).toEqual(configuration.USERS_ENDPOINT);
    expect(body).toEqual(
      expect.objectContaining({
        last_name: lastName,
        first_name: firstName,
        username,
      })
    );
  });

  it('should NOT post user data on submit when user does not have permissions', async () => {
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => false);

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: undefined }));

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    const lastName = 'Foo Bar Baz';
    fireEvent.change(getByTestId('detailUserForm').querySelector('#last_name'), { target: { value: lastName } });

    const firstName = 'Zork';
    fireEvent.change(getByTestId('detailUserForm').querySelector('#first_name'), { target: { value: firstName } });

    expect(fetch).not.toHaveBeenCalledWith(configuration.USERS_ENDPOINT, expect.objectContaining({ method: 'POST' }));

    fireEvent.submit(document.forms[0]);

    expect(fetch).not.toHaveBeenCalledWith(configuration.USERS_ENDPOINT, expect.objectContaining({ method: 'POST' }));
  });

  it('should convert stringified booleans to boolean values', async () => {
    fetch.resetMocks();

    fetch.once(JSON.stringify({ ...userFixture, is_active: false })).once(JSON.stringify(historyFixture));

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    // ensure that a boolean value is a string value
    expect(getByTestId('detailUserForm').querySelector('[name="is_active"][value="false"]').checked).toBe(true);

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );

    act(() => {
      // change a field's value so that the form will be submitted
      fireEvent.change(getByTestId('detailUserForm').querySelector('#last_name'), { target: { value: 'Foo Bar Baz' } });
    });

    act(() => {
      fireEvent.click(getByTestId('detailUserForm').querySelector('[type="submit"]'));
    });

    await findByTestId('userDetailFormContainer');

    const [url, params] = fetch.mock.calls[2];
    const body = JSON.parse(params.body);

    expect(url).toEqual(`${configuration.USERS_ENDPOINT}${userId}`);
    expect(body).toEqual(
      expect.objectContaining({
        is_active: false,
      })
    );

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('should direct to the overview page when cancel button is clicked and form data is pristine', async () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({}));

    global.window.confirm = jest.fn();

    const { findByTestId, rerender, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    expect(push).toHaveBeenCalledTimes(0);

    act(() => {
      fireEvent.click(getByTestId('cancelBtn'));
    });

    expect(global.window.confirm).not.toHaveBeenCalled();

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(routes.users));

    rerender(withAppContext(<UserDetail />));

    expect(push).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(getByTestId('cancelBtn'));
    });

    expect(global.window.confirm).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(routes.users));
  });

  it('should direct to the overview page when cancel button is clicked and form data is NOT pristine', async () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({}));

    global.window.confirm = jest.fn();

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    expect(push).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(getByTestId('detailUserForm').querySelector('#last_name'), { target: { value: 'Foo Bar Baz' } });
    });

    act(() => {
      fireEvent.click(getByTestId('cancelBtn'));
    });

    expect(global.window.confirm).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(0);

    global.window.confirm.mockReturnValue(true);

    act(() => {
      fireEvent.click(getByTestId('cancelBtn'));
    });

    expect(global.window.confirm).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(routes.users));
  });

  it('should push to correct URL when cancel button is clicked and form data is pristine', async () => {
    const referrer = '/some-page-we-came-from';
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({ referrer }));

    global.window.confirm = jest.fn();

    const { findByTestId, rerender, getByTestId } = render(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    expect(push).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(getByTestId('cancelBtn'));
    });

    // user is only asked for confirmation when form data isn't pristine
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(referrer));

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({ referrer }));

    rerender(withAppContext(<UserDetail />));

    await findByTestId('userDetailFormContainer');

    act(() => {
      fireEvent.click(getByTestId('cancelBtn'));
    });

    // user is only asked for confirmation when form data isn't pristine
    expect(global.window.confirm).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(referrer));
  });
});
