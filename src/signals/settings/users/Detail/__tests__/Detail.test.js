import React from 'react';
import { act } from 'react-dom/test-utils';
import { withAppContext } from 'test/utils';
import { fireEvent, render } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';

import configuration from 'shared/services/configuration/configuration';

import routes from 'signals/settings/routes';

import userJSON from 'utils/__tests__/fixtures/user.json';
import rolesJson from 'utils/__tests__/fixtures/roles.json';
import departmentsJson from 'utils/__tests__/fixtures/departments.json';
import inputCheckboxRolesSelectorJson from
  'utils/__tests__/fixtures/inputCheckboxRolesSelector.json';

import * as rolesSelectors from 'models/roles/selectors';
import * as modelSelectors from 'models/departments/selectors';
import * as appSelectors from 'containers/App/selectors';

import useFetch from 'hooks/useFetch';

import UserDetail from '..';

const departments = {
  ...departmentsJson,
  count: departmentsJson.count,
  list: departmentsJson.results,
  results: undefined,
};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('hooks/useFetch');

jest.mock('containers/App/actions', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/actions'),
}));

jest.mock('containers/App/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/selectors'),
}));

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({ push }));

jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: userJSON.id }));

const get = jest.fn();
const patch = jest.fn();
const post = jest.fn();

const useFetchResponse = {
  get,
  patch,
  post,
  data: undefined,
  isLoading: false,
  error: false,
  isSuccess: false,
};

jest.mock('models/departments/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/departments/selectors'),
}));

jest.mock('models/roles/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/roles/selectors'),
}));

jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => departments);

jest.spyOn(rolesSelectors, 'inputCheckboxRolesSelector').mockImplementation(() =>
  inputCheckboxRolesSelectorJson
);

jest.spyOn(rolesSelectors, 'rolesModelSelector').mockImplementation(() => ({ list: rolesJson }));

describe('signals/settings/users/containers/Detail', () => {
  beforeEach(() => {
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => true);
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: userJSON.id }));
    useFetch.mockImplementation(() => useFetchResponse);
  });

  afterEach(() => {
    push.mockReset();
    get.mockReset();
    patch.mockReset();
    post.mockReset();
  });

  it('should render a backlink', () => {
    const referrer = '/some-page-we-came-from';
    let getByTestId;
    let rerender;
    let unmount;

    act(() => { ({ getByTestId, rerender, unmount } = render(withAppContext(<UserDetail />))); });

    expect(getByTestId('backlink').getAttribute('href')).toEqual(routes.users);

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({ referrer }));

    unmount();

    act(() => { rerender(withAppContext(<UserDetail />)); });

    expect(getByTestId('backlink').closest('a').getAttribute('href')).toEqual(referrer);
  });

  it('should render the correct title', () => {
    const userId = userJSON.id;

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: undefined }));

    const { getByText, rerender } = render(withAppContext(<UserDetail />));

    expect(getByText('Gebruiker toevoegen')).toBeInTheDocument();

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId }));

    rerender(withAppContext(<UserDetail />));

    expect(getByText('Gebruiker wijzigen')).toBeInTheDocument();
  });

  it('should get', () => {
    render(withAppContext(<UserDetail />));

    expect(get).toHaveBeenCalledTimes(1);
  });

  it('should render a loading indicator', () => {
    useFetch.mockImplementation(() => ({ ...useFetchResponse, isLoading: true }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(getByTestId('loadingIndicator')).toBeInTheDocument();
  });

  it('should not render a form when the data from the API is not yet available', () => {
    const userId = userJSON.id;
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId }));

    const { queryByTestId } = render(withAppContext(<UserDetail />));

    expect(queryByTestId('detailUserForm')).toBeNull();
  });

  it('should render a form when the URL contains a user ID AND the data has been retrieved from the API', () => {
    const userId = userJSON.id;
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId }));

    useFetch.mockImplementation(() => ({ ...useFetchResponse, isLoading: true }));

    const { queryByTestId, getByTestId, rerender, unmount } = render(withAppContext(<UserDetail />));

    expect(queryByTestId('detailUserForm')).toBeNull();

    unmount();

    useFetch.mockImplementation(() => ({ ...useFetchResponse, data: userJSON }));

    rerender(withAppContext(<UserDetail />));

    expect(getByTestId('detailUserForm')).toBeInTheDocument();
  });

  it('should render a form when the URL does not contain a user ID', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: undefined }));

    useFetch.mockImplementation(() => ({ ...useFetchResponse, data: userJSON }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(getByTestId('detailUserForm')).toBeInTheDocument();
  });

  it('should not patch user data on submit when form data has not been altered', () => {
    useFetch.mockImplementation(() => ({ ...useFetchResponse,  data: userJSON }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(patch).not.toHaveBeenCalled();

    act(() => { fireEvent.click(getByTestId('detailUserForm').querySelector('[type="submit"]')); });

    expect(patch).not.toHaveBeenCalled();
  });

  it('should patch user data on submit', () => {
    useFetch.mockImplementation(() => ({ ...useFetchResponse,  data: userJSON }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(patch).not.toHaveBeenCalled();

    act(() => {
      const lastNameInput = getByTestId('detailUserForm').querySelector('#last_name');
      fireEvent.change(lastNameInput, { target: { value: 'Foo Bar Baz' } });
    });

    act(() => {
      fireEvent.click(getByTestId('detailUserForm').querySelector('[type="submit"]'));
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalled();
  });

  it('should NOT patch user data on submit when user does not have permissions', () => {
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => false);
    useFetch.mockImplementation(() => ({ ...useFetchResponse,  data: userJSON }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(patch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(
        getByTestId('detailUserForm').querySelector('#last_name'),
        { target: { value: 'Foo Bar Baz' } }
      );
    });

    expect(patch).not.toHaveBeenCalled();

    act(() => { fireEvent.submit(document.forms[0]); });

    expect(patch).not.toHaveBeenCalled();
  });

  it('should post user data on submit', () => {
    useFetch.mockImplementation(() => ({ ...useFetchResponse,  data: userJSON }));

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: undefined }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    const lastName = 'Foo Bar Baz';
    act(() => {
      fireEvent.change(
        getByTestId('detailUserForm').querySelector('#last_name'),
        { target: { value: lastName } }
      );
    });

    const firstName = 'Zork';
    act(() => {
      fireEvent.change(
        getByTestId('detailUserForm').querySelector('#first_name'),
        { target: { value: firstName } }
      );
    });

    const username = 'zork@foobarbaz.com';
    act(() => {
      fireEvent.change(getByTestId('detailUserForm').querySelector('#username'), {
        target: { value: username },
      });
    });

    expect(post).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(getByTestId('detailUserForm').querySelector('[type="submit"]'));
    });

    expect(post).toHaveBeenCalledWith(
      configuration.USERS_ENDPOINT,
      expect.objectContaining({
        last_name: lastName,
        first_name: firstName,
        // username is not in the payload, because its value is readOnly
      })
    );
  });

  it('should NOT post user data on submit when user does not have permissions', () => {
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => false);
    useFetch.mockImplementation(() => ({
      ...useFetchResponse,
      data: { first_name: '', last_name: '' },
    }));

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ userId: undefined }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    const lastName = 'Foo Bar Baz';
    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#last_name'),
      { target: { value: lastName } }
    );

    const firstName = 'Zork';
    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#first_name'),
      { target: { value: firstName } }
    );

    expect(post).not.toHaveBeenCalled();

    fireEvent.submit(document.forms[0]);

    expect(post).not.toHaveBeenCalled();
  });

  it('should convert stringified booleans to boolean values', () => {
    useFetch.mockImplementation(() => ({
      ...useFetchResponse,
      data: { ...userJSON, is_active: false },
    }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    // ensure that a boolean value is a string value
    expect(
      getByTestId('detailUserForm').querySelector('[name="is_active"][value="false"]').checked
    ).toBe(true);

    expect(patch).not.toHaveBeenCalled();

    act(() => {
      // change a field's value so that the form will be submitted
      fireEvent.change(
        getByTestId('detailUserForm').querySelector('#last_name'),
        { target: { value: 'Foo Bar Baz' } }
      );
    });

    act(() => {
      fireEvent.click(getByTestId('detailUserForm').querySelector('[type="submit"]'));
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userJSON.id}`,
      expect.objectContaining({ is_active: false })
    );
  });

  it('should direct to the overview page when cancel button is clicked and form data is pristine', () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({}));
    useFetch.mockImplementation(() => ({ ...useFetchResponse,  data: userJSON }));

    global.window.confirm = jest.fn();

    const { rerender, getByTestId } = render(withAppContext(<UserDetail />));

    expect(push).toHaveBeenCalledTimes(0);

    fireEvent.click(getByTestId('cancelBtn'));

    expect(global.window.confirm).not.toHaveBeenCalled();

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(routes.users));

    rerender(withAppContext(<UserDetail />));

    expect(push).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId('cancelBtn'));

    expect(global.window.confirm).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(routes.users),
    );
  });

  it('should direct to the overview page when cancel button is clicked and form data is NOT pristine', () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({}));
    useFetch.mockImplementation(() => ({ ...useFetchResponse,  data: userJSON }));

    global.window.confirm = jest.fn();

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(push).not.toHaveBeenCalled();

    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#last_name'),
      { target: { value: 'Foo Bar Baz' } }
    );

    fireEvent.click(getByTestId('cancelBtn'));

    expect(global.window.confirm).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(0);

    global.window.confirm.mockReturnValue(true);

    fireEvent.click(getByTestId('cancelBtn'));

    expect(global.window.confirm).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(routes.users),
    );
  });

  it('should push to correct URL when cancel button is clicked and form data is pristine', () => {
    const referrer = '/some-page-we-came-from';
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({ referrer }));

    useFetch.mockImplementation(() => ({ ...useFetchResponse,  data: userJSON }));

    global.window.confirm = jest.fn();

    const { rerender, getByTestId } = render(withAppContext(<UserDetail />));

    expect(push).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(getByTestId('cancelBtn'));
    });

    // user is only asked for confirmation when form data isn't pristine
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(referrer));

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({ referrer }));

    rerender(withAppContext(<UserDetail />));

    fireEvent.click(getByTestId('cancelBtn'));

    // user is only asked for confirmation when form data isn't pristine
    expect(global.window.confirm).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledWith(expect.stringContaining(referrer));
  });
});
