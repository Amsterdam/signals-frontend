import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext } from 'test/utils';
import routes from 'signals/settings/routes';
import userJSON from 'utils/__tests__/fixtures/user.json';

import useFetchUser from '../hooks/useFetchUser';
import UserDetail from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('../hooks/useFetchUser', () =>
  jest.fn(() => ({ isLoading: undefined }))
);

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

  it('should instantiate useFetchUser', () => {
    render(withAppContext(<UserDetail />));

    expect(useFetchUser).toHaveBeenCalled();
  });

  it('should render a loading indicator', () => {
    useFetchUser.mockImplementationOnce(() => ({ isLoading: true }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(getByTestId('loadingIndicator')).toBeInTheDocument();
  });

  it('should render a form', () => {
    useFetchUser.mockImplementationOnce(() => ({ data: userJSON }));

    const { getByTestId } = render(withAppContext(<UserDetail />));

    expect(getByTestId('detailUserForm')).toBeInTheDocument();
  });

  it('should show an alert on error', () => {
    const message = 'Something went wrong here';
    useFetchUser.mockImplementationOnce(() => ({ error: { message } }));

    const { getByTestId, getByText } = render(withAppContext(<UserDetail />));

    expect(getByTestId('formAlert')).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
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

    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#last_name'),
      { target: { value: 'Foo Bar Baz' } }
    );
    fireEvent.click(
      getByTestId('detailUserForm').querySelector('[type="submit"]')
    );

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

    // change a field's value so that the form will be submitted
    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#last_name'),
      { target: { value: 'Foo Bar Baz' } }
    );
    fireEvent.click(
      getByTestId('detailUserForm').querySelector('[type="submit"]')
    );

    expect(patch).toHaveBeenCalledWith(
      expect.objectContaining({ is_active: false })
    );
  });

  it('should show a notification on successful PATCH', () => {
    const message = 'Gegevens opgeslagen';

    useFetchUser.mockImplementationOnce(() => ({ isSuccess: true }));

    const { getByTestId, getByText } = render(withAppContext(<UserDetail />));

    expect(getByTestId('formAlert')).toBeInTheDocument();
    expect(getByText(message)).toBeInTheDocument();
  });

  it('should replace history on successful POST', () => {
    const id = 123;
    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      userId: undefined,
    }));

    const replace = jest.fn();
    jest.spyOn(reactRouterDom, 'useHistory').mockImplementationOnce(() => ({
      replace,
    }));

    useFetchUser.mockImplementationOnce(() => ({ isSuccess: true, data: { id } }));

    render(withAppContext(<UserDetail />));

    expect(replace).toHaveBeenCalledWith(expect.stringMatching(/123$/));
  });

  it('should push to history on cancel', () => {
    useFetchUser.mockImplementationOnce(() => ({ data: userJSON }));

    global.window.confirm = jest.fn();

    const { getByTestId } = render(withAppContext(<UserDetail />));

    fireEvent.click(getByTestId('cancelBtn'));

    expect(global.window.confirm).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalled();
  });

  it('should confirm on cancel', () => {
    useFetchUser.mockImplementationOnce(() => ({ data: userJSON }));

    global.window.confirm = jest.fn();

    const { getByTestId } = render(withAppContext(<UserDetail />));

    fireEvent.change(
      getByTestId('detailUserForm').querySelector('#last_name'),
      { target: { value: 'Foo Bar Baz' } }
    );

    fireEvent.click(getByTestId('cancelBtn'));

    expect(global.window.confirm).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    global.window.confirm.mockReturnValue(true);
    fireEvent.click(getByTestId('cancelBtn'));

    expect(push).toHaveBeenCalled();
  });
});
