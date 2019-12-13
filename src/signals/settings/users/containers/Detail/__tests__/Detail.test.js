import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext } from 'test/utils';
import routes from 'signals/settings/routes';
import userJSON from 'utils/__tests__/fixtures/user.json';
import * as actions from 'containers/App/actions';
import {
  VARIANT_ERROR,
  VARIANT_SUCCESS,
  TYPE_LOCAL,
} from 'containers/Notification/constants';

import useFetchUser from '../hooks/useFetchUser';
import UserDetail from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('../hooks/useFetchUser', () =>
  jest.fn(() => ({ isLoading: undefined }))
);

jest.mock('containers/App/actions', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/actions'),
}));

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}));

jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  userId: userJSON.id,
}));

describe('signals/settings/users/containers/Detail', () => {
  afterEach(() => {
    push.mockReset();
  });

  it('should render a backlink', async () => {
    const referrer = '/some-page-we-came-from';
    let container;

    await act(async () => {
      ({ container } = await render(withAppContext(<UserDetail />)));
    });

    expect(container.querySelector('a').getAttribute('href')).toEqual(
      routes.users
    );

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementationOnce(() => ({
      referrer,
    }));

    cleanup();

    await act(async () => {
      ({ container } = await render(withAppContext(<UserDetail />)));
    });

    expect(container.querySelector('a').getAttribute('href')).toEqual(referrer);
  });

  it('should render the correct title', () => {
    const userId = userJSON.id;

    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      userId: undefined,
    }));

    const { getByText, rerender } = render(withAppContext(<UserDetail />));

    expect(getByText('Gebruiker toevoegen')).toBeInTheDocument();

    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      userId,
    }));

    rerender(withAppContext(<UserDetail />));

    expect(getByText('Gebruiker wijzigen')).toBeInTheDocument();
  });

  it('should instantiate useFetchUser', () => {
    render(withAppContext(<UserDetail />));

    expect(useFetchUser).toHaveBeenCalled();
  });

  it('should render a loading indicator', () => {
    useFetchUser.mockImplementationOnce(() => ({ isLoading: true }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(getByTestId('loadingIndicator')).toBeInTheDocument();
  });

  it('should not render a form when the data from the API is not yet available', async () => {
    const userId = userJSON.id;
    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      userId,
    }));

    const { queryByTestId } = await render(withAppContext(<UserDetail />));

    expect(queryByTestId('detailUserForm')).toBeNull();

  });

  it('should render a form when the URL contains a user ID AND the data has been retrieved from the API', async () => {
    const userId = userJSON.id;
    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      userId,
    }));

    useFetchUser.mockImplementationOnce(() => ({ loading: true }));

    const { queryByTestId } = await render(withAppContext(<UserDetail />));

    expect(queryByTestId('detailUserForm')).toBeNull();

    cleanup();

    useFetchUser.mockImplementationOnce(() => ({ data: userJSON }));

    const { getByTestId } = await render(withAppContext(<UserDetail />));

    expect(getByTestId('detailUserForm')).toBeInTheDocument();
  });

  it('should render a form when the URL does not contain a user ID', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      userId: undefined,
    }));

    useFetchUser.mockImplementationOnce(() => ({ data: userJSON }));

    const { getByTestId } = await render(withAppContext(<UserDetail />));

    expect(getByTestId('detailUserForm')).toBeInTheDocument();
  });

  it('should show an alert on error', () => {
    const showNotificationSpy = jest.spyOn(actions, 'showGlobalNotification');
    const message = 'Something went wrong here';

    useFetchUser.mockImplementationOnce(() => ({ isLoading: true, error: { message } }));

    const { rerender } = render(withAppContext(<UserDetail />));

    // should not show when loading
    expect(showNotificationSpy).not.toHaveBeenCalled();

    useFetchUser.mockImplementationOnce(() => ({ error: { message } }));

    rerender(withAppContext(<UserDetail />));

    expect(showNotificationSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: message,
      variant: VARIANT_ERROR,
      type: TYPE_LOCAL,
    }));
  });

  it('should not patch user data on submit when form data has not been altered', () => {
    const patch = jest.fn();
    useFetchUser.mockImplementationOnce(() => ({ data: userJSON, patch }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    fireEvent.click(
      getByTestId('detailUserForm').querySelector('[type="submit"]')
    );

    expect(patch).not.toHaveBeenCalled();
  });

  it('should patch user data on submit', () => {
    const patch = jest.fn();
    useFetchUser.mockImplementationOnce(() => ({ data: userJSON, patch }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(patch).not.toHaveBeenCalled();

    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#last_name'),
      { target: { value: 'Foo Bar Baz' } }
    );
    fireEvent.click(
      getByTestId('detailUserForm').querySelector('[type="submit"]')
    );

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalled();
  });

  it('should post user data on submit', () => {
    const post = jest.fn();
    useFetchUser.mockImplementationOnce(() => ({ data: {}, post }));

    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      userId: undefined,
    }));

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

    const username = 'zork@foobarbaz.com';
    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#username'),
      { target: { value: username } }
    );

    fireEvent.click(
      getByTestId('detailUserForm').querySelector('[type="submit"]')
    );

    expect(post).toHaveBeenCalledWith(expect.objectContaining({ last_name: lastName, first_name: firstName, username }));
  });

  it.only('should redirect on success and show notification', () => {
    const showNotificationSpy = jest.spyOn(actions, 'showGlobalNotification');
    useFetchUser.mockImplementation(() => ({ data: userJSON, isLoading: true, isSuccess: true }));

    expect(push).toHaveBeenCalledTimes(0);
    expect(showNotificationSpy).not.toHaveBeenCalled();

    const { rerender } = render(withAppContext(<UserDetail />));

    expect(push).toHaveBeenCalledTimes(0);
    expect(showNotificationSpy).not.toHaveBeenCalled();

    useFetchUser.mockImplementation(() => ({ data: userJSON, isLoading: false, isSuccess: true }));

    rerender(withAppContext(<UserDetail />));

    expect(push).toHaveBeenCalledTimes(1);
    expect(showNotificationSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Gegevens opgeslagen',
      variant: VARIANT_SUCCESS,
      type: TYPE_LOCAL,
    }));
  });

  it('should convert stringified booleans to boolean values', () => {
    const patch = jest.fn();
    useFetchUser.mockImplementationOnce(() => ({
      data: { ...userJSON, is_active: false },
      patch,
    }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    // ensure that a boolean value is a string value
    expect(
      getByTestId('detailUserForm').querySelector(
        '[name="is_active"][value="false"][checked]'
      )
    ).toBeInTheDocument();

    expect(patch).not.toHaveBeenCalled();

    // change a field's value so that the form will be submitted
    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#last_name'),
      { target: { value: 'Foo Bar Baz' } }
    );
    fireEvent.click(
      getByTestId('detailUserForm').querySelector('[type="submit"]')
    );

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith(
      expect.objectContaining({ is_active: false })
    );
  });

  it('should show a notification on successful PATCH', () => {
    const message = 'Gegevens opgeslagen';

    useFetchUser.mockImplementationOnce(() => ({ isSuccess: true }));

    const { queryByTestId, rerender, getByTestId, getByText } = render(withAppContext(<UserDetail />));

    expect(getByTestId('formAlert')).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();

    // should not show when loading
    useFetchUser.mockImplementationOnce(() => ({ isLoading: true, isSuccess: true }));

    rerender(withAppContext(<UserDetail />));

    expect(queryByTestId('formAlert')).toBeNull();
  });

  it('should replace history on successful POST', () => {
    const id = userJSON.id;
    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      userId: undefined,
    }));

    const replace = jest.fn();
    jest.spyOn(reactRouterDom, 'useHistory').mockImplementationOnce(() => ({
      replace,
    }));

    useFetchUser.mockImplementationOnce(() => ({ isSuccess: true, data: { id } }));

    expect(replace).not.toHaveBeenCalled();

    render(withAppContext(<UserDetail />));

    expect(replace).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`${id}$`)));
  });

  it('should direct to the overview page when cancel button is clicked and form data is pristine', () => {
    useFetchUser.mockImplementationOnce(() => ({ data: userJSON }));

    global.window.confirm = jest.fn();

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(push).not.toHaveBeenCalled();

    fireEvent.click(getByTestId('cancelBtn'));

    expect(global.window.confirm).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(routes.users);
  });

  it('should direct to the overview page when cancel button is clicked and form data is NOT pristine', () => {
    useFetchUser.mockImplementationOnce(() => ({ data: userJSON }));

    global.window.confirm = jest.fn();

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(push).not.toHaveBeenCalled();

    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#last_name'),
      { target: { value: 'Foo Bar Baz' } }
    );

    fireEvent.click(getByTestId('cancelBtn'));

    expect(global.window.confirm).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    global.window.confirm.mockReturnValue(true);
    fireEvent.click(getByTestId('cancelBtn'));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(routes.users);
  });

  it('should push to correct URL when cancel button is clicked and form data is pristine', () => {
    const referrer = '/some-page-we-came-from';
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementationOnce(() => ({
      referrer,
    }));

    useFetchUser.mockImplementationOnce(() => ({ data: userJSON }));

    global.window.confirm = jest.fn();

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(push).not.toHaveBeenCalled();

    fireEvent.click(getByTestId('cancelBtn'));

    // user is only asked for confirmation when form data isn't pristine
    expect(global.window.confirm).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(referrer);
  });
});
