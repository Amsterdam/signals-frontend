import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext } from 'test/utils';

import categories from 'utils/__tests__/fixtures/categories_structured.json';
import { CATEGORY_URL, CATEGORIES_PAGED_URL } from 'signals/settings/routes';
import * as constants from 'containers/App/constants';
import { CategoriesOverviewContainer as CategoriesOverview } from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  pageNum: '1',
}));

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}));

jest.mock('containers/App/constants', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/constants'),
}));

const scrollTo = jest.fn();
global.window.scrollTo = scrollTo;

constants.PAGE_SIZE = 50;

const subCategories = Object.entries(categories).flatMap(([, { sub }]) => sub);
const count = subCategories.length;

describe('signals/settings/categories/containers/Overview', () => {
  beforeEach(() => {
    push.mockReset();
  });

  it('should render header', () => {
    const { getByText, rerender } = render(
      withAppContext(<CategoriesOverview subCategories={null} userCan={() => {}} />)
    );

    expect(getByText('Categorieën')).toBeInTheDocument();

    rerender(withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => {}} />));

    expect(getByText(`Categorieën (${count})`)).toBeInTheDocument();
  });

  it('should render paged data', () => {
    const firstCategory = subCategories[0];
    const lastCategory = subCategories[constants.PAGE_SIZE - 1];

    // render the first page
    const { container, rerender } = render(
      withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => {}} />)
    );

    expect(container.querySelector(`tr[data-item-id="${firstCategory.fk}"]`)).toBeInTheDocument();
    expect(container.querySelector(`tr[data-item-id="${lastCategory.fk}"]`)).toBeInTheDocument();

    // render the second page
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: '2',
    }));

    rerender(withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => {}} />));

    const secondPageFirstCategory = subCategories[constants.PAGE_SIZE + 1];
    const secondPageLastCategory = subCategories[constants.PAGE_SIZE * 2 - 1];

    expect(container.querySelector(`tr[data-item-id="${secondPageFirstCategory.fk}"]`)).toBeInTheDocument();
    expect(container.querySelector(`tr[data-item-id="${secondPageLastCategory.fk}"]`)).toBeInTheDocument();
  });

  it('should only render specific data columns', () => {
    const { getByText } = render(
      withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => {}} />)
    );

    expect(getByText('Categorie')).toBeInTheDocument();
    expect(getByText('Service Level Agreement')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();
  });

  it('should render pagination controls', () => {
    const { rerender, queryByTestId } = render(
      withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => {}} />)
    );

    expect(queryByTestId('pagination')).toBeInTheDocument();

    constants.PAGE_SIZE = count + 1;

    rerender(withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => {}} />));

    expect(queryByTestId('pagination')).not.toBeInTheDocument();

    constants.PAGE_SIZE = 50;
  });

  it('should push to the history stack and scroll to top on pagination item click', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: '1',
    }));

    const { getByText } = render(
      withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => {}} />)
    );

    const pageButton = getByText('2');

    expect(scrollTo).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(pageButton);
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(`${CATEGORIES_PAGED_URL}/2`);
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should push on list item with an itemId click', async () => {
    const { container } = render(
      withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => true} />)
    );
    const itemId = 666;

    let row;

    await waitFor(() => {
      row = container.querySelector('tbody tr:nth-child(42)');
    });

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = itemId;

    expect(push).toHaveBeenCalledTimes(0);

    act(() => {
      fireEvent.click(row);
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(`${CATEGORY_URL}/${itemId}`);

    // Remove 'itemId' and fire click event again.
    delete row.dataset.itemId;

    act(() => {
      fireEvent.click(row);
    });

    expect(push).toHaveBeenCalledTimes(1);

    // Set 'itemId' again and fire click event once more.
    row.dataset.itemId = itemId;

    act(() => {
      fireEvent.click(row);
    });

    expect(push).toHaveBeenCalledTimes(2);
  });

  it('should not push on list item click when permissions are insufficient', async () => {
    const { container } = render(
      withAppContext(<CategoriesOverview subCategories={subCategories} userCan={() => false} />)
    );
    const itemId = 666;

    let row;

    await waitFor(() => {
      row = container.querySelector('tbody tr:nth-child(42)');
    });

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = itemId;

    expect(push).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(row);
    });

    expect(push).not.toHaveBeenCalled();
  });
});
