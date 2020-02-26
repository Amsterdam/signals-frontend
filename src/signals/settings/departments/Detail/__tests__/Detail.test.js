import React from 'react';
import { mount } from 'enzyme';
import { act, render, fireEvent, wait } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';

import { withAppContext } from 'test/utils';
import routes from 'signals/settings/routes';
import departmentJson from 'utils/__tests__/fixtures/department.json';
import categories from 'utils/__tests__/fixtures/categories_structured.json';
import useFetch from 'hooks/useFetch';
import CONFIGURATION from 'shared/services/configuration/configuration';

import DepartmentDetail, { DepartmentDetailContainer } from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('hooks/useFetch');

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}));

const location = {};
jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
  location,
}));

const departmentId = departmentJson.id;
jest
  .spyOn(reactRouterDom, 'useParams')
  .mockImplementation(() => ({ departmentId }));

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

useFetch.mockImplementation(() => useFetchResponse);

const subCategories = Object.entries(categories).flatMap(
  ([, { sub }]) => sub
);

const findByMain = parentKey =>
  subCategories.filter(category => category.parentKey === parentKey);

describe('signals/settings/departments/Detail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have props from structured selector', async () => {
    const tree = mount(withAppContext(<DepartmentDetail />));

    await wait();

    const containerProps = tree.find(DepartmentDetailContainer).props();

    expect(containerProps.categories).not.toBeUndefined();
    expect(containerProps.findByMain).not.toBeUndefined();
    expect(containerProps.subCategories).not.toBeUndefined();
  });

  it('should render a backlink', async () => {
    const { container } = render(withAppContext(<DepartmentDetailContainer />));

    await wait();

    expect(container.querySelector('a').getAttribute('href')).toEqual(
      routes.departments
    );
  });

  it('should render the correct title', async () => {
    const { getByText, rerender } = render(
      withAppContext(<DepartmentDetailContainer />)
    );

    await wait();

    expect(getByText('Afdeling wijzigen')).toBeInTheDocument();

    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      departmentId: undefined,
    }));

    rerender(withAppContext(<DepartmentDetailContainer />));

    await wait();

    expect(getByText('Afdeling toevoegen')).toBeInTheDocument();
  });

  it('should render a loading indicator', async () => {
    const { queryByTestId, rerender } = render(
      withAppContext(<DepartmentDetailContainer />)
    );

    await wait();

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();

    useFetch.mockImplementationOnce(() => ({
      ...useFetchResponse,
      isLoading: true,
    }));

    rerender(withAppContext(<DepartmentDetailContainer />));

    await wait();

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
  });

  it('should render the department name', async () => {
    const { queryByText, getByText, rerender } = render(
      withAppContext(<DepartmentDetailContainer />)
    );

    await wait();

    expect(queryByText(departmentJson.name)).not.toBeInTheDocument();

    useFetch.mockImplementationOnce(() => ({
      ...useFetchResponse,
      data: departmentJson,
    }));

    rerender(withAppContext(<DepartmentDetailContainer />));

    await wait();

    expect(getByText(departmentJson.name)).toBeInTheDocument();
  });

  it('should render category lists', async () => {
    const { queryByTestId, rerender } = render(
      withAppContext(<DepartmentDetailContainer />)
    );

    await wait();

    expect(queryByTestId('categoryLists')).not.toBeInTheDocument();

    useFetch.mockImplementation(() => ({
      ...useFetchResponse,
      data: departmentJson,
    }));

    rerender(withAppContext(<DepartmentDetailContainer />));

    await wait();

    expect(queryByTestId('categoryLists')).not.toBeInTheDocument();

    rerender(
      withAppContext(
        <DepartmentDetailContainer
          categories={categories}
          subCategories={subCategories}
          findByMain={parentKey =>
            subCategories.filter(category => category.parentKey === parentKey)
          }
        />
      )
    );

    await wait();

    expect(queryByTestId('categoryLists')).toBeInTheDocument();
  });

  it('should fetch on mount', async () => {
    expect(get).not.toHaveBeenCalled();

    render(withAppContext(<DepartmentDetailContainer />));

    await wait();

    expect(get).toHaveBeenCalledWith(
      `${CONFIGURATION.DEPARTMENTS_ENDPOINT}${departmentId}`
    );
  });

  it('should patch on submit', async () => {
    const { container } = render(
      withAppContext(
        <DepartmentDetailContainer
          categories={categories}
          subCategories={subCategories}
          findByMain={findByMain}
        />
      )
    );

    await wait();

    expect(patch).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(container.querySelector('[type=submit]'));
    });

    expect(patch).toHaveBeenCalled();
  });
});
