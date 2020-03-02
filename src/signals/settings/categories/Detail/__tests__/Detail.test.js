import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, wait } from '@testing-library/react';
import { mount } from 'enzyme';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext } from 'test/utils';
import routes from 'signals/settings/routes';
import categoryJSON from 'utils/__tests__/fixtures/category.json';

import CategoryDetailContainer, { CategoryDetailContainerComponent } from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

// jest.spyOn(reactRouterDom, 'useLocation').mockImplementationOnce(() => ({
//   referrer: undefined,
// }));
fetch.mockResponse(JSON.stringify(categoryJSON));

describe('signals/settings/categories/Detail', () => {
  it('should have props from structured selector', async () => {
    let tree;

    await act(async () => {
      tree = mount(withAppContext(<CategoryDetailContainer />));
    });

    const props = tree.find(CategoryDetailContainerComponent).props();

    expect(props.userCan).toBeDefined();
  });

  it('should render a backlink', async () => {
    let container;

    await act(async () => {
      ({ container } = render(
        withAppContext(
          <CategoryDetailContainerComponent userCan={() => true} />
        )
      ));
    });

    expect(container.querySelector('a').getAttribute('href')).toEqual(
      routes.categories
    );
  });

  it('should render a backlink with the proper referrer', async () => {
    const referrer = '/some-page-we-came-from';

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer,
    }));

    let container;

    await act(async () => {
      ({ container } = render(
        withAppContext(
          <CategoryDetailContainerComponent userCan={() => true} />
        )
      ));
    });

    expect(container.querySelector('a').getAttribute('href')).toEqual(referrer);
  });

  it('should render the correct page title for a new category', async () => {
    let getByText;

    await act(async () => {
      ({ getByText } = render(
        withAppContext(
          <CategoryDetailContainerComponent userCan={() => true} />
        )
      ));
    });

    expect(getByText('Categorie toevoegen')).toBeInTheDocument();
  });

  it('should render the correct page title for an existing category', async () => {
    const categoryId = categoryJSON.id;

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId,
    }));

    let getByText;

    await act(async () => {
      ({ getByText } = render(
        withAppContext(
          <CategoryDetailContainerComponent userCan={() => true} />
        )
      ));
    });

    expect(getByText('Categorie wijzigen')).toBeInTheDocument();
  });

  it('should render a loading indicator', async () => {
    fetch.mockResponse(
      () =>
        new Promise(resolve => setTimeout(() => resolve(JSON.stringify(categoryJSON)), 100))
    );

    // detailCategoryForm
    let getByTestId;

    // await act(async () => {
      ({ getByTestId } = render(
        withAppContext(
          <CategoryDetailContainerComponent userCan={() => true} />
        )
      ));
    // });

    expect(getByTestId('loadingIndicator')).toBeInTheDocument();

    await wait();

    expect(getByTestId('loadingIndicator')).not.toBeInTheDocument();
  });
});
