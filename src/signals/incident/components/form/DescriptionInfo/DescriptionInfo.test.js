import React from 'react';
import { render } from '@testing-library/react';

import * as reactRedux from 'react-redux';
import * as auth from 'shared/services/auth/auth';
import { withAppContext } from 'test/utils';
import { fetchCategories } from 'models/categories/actions';
import * as catgorySelectors from 'models/categories/selectors';
import * as incidentContainerSelectors from 'signals/incident/containers/IncidentContainer/selectors';
import categoriesFixture from 'utils/__tests__/fixtures/categories_private.json';
import DescriptionInfo from '.';

const subcategory = categoriesFixture.results
  .filter(catgorySelectors.filterForSub).find(category => category.is_active);

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

jest.mock('shared/services/auth/auth');

describe('signals/incident/components/form/DescriptionInfo', () => {
  beforeEach(() => {});

  it('should render with no suggestion', async () => {
    const { findByTestId } = render(withAppContext(<DescriptionInfo info="the-info" />));

    const element = await findByTestId('descriptionInfo');
    expect(element.firstChild.textContent).toEqual('the-info');
  });

  it('should fetch categories when authenticated', async () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);
    const { findByTestId } = render(withAppContext(<DescriptionInfo info="the-info" />));

    await findByTestId('descriptionInfo');
    expect(dispatch).toHaveBeenCalledWith(fetchCategories());
  });

  it('should show the suggestion when subcategory is active', async () => {
    jest.spyOn(catgorySelectors, 'makeSelectSubCategories').mockImplementation(() => [subcategory]);
    jest.spyOn(incidentContainerSelectors, 'makeSelectIncidentContainer').mockImplementation(() => ({ subcategoryPrediction: subcategory.slug }));
    const { findByTestId, queryByText } = render(withAppContext(<DescriptionInfo info="the-info" />));

    await findByTestId('descriptionInfo');
    expect(queryByText(`Subcategorie voorstel: ${subcategory.name}`)).toBeInTheDocument();
  });

  it('should show NO suggestion when subcategory is NOT active', async () => {
    jest.spyOn(catgorySelectors, 'makeSelectSubCategories').mockImplementation(() => [{ ...subcategory, is_active: false }]);
    jest.spyOn(incidentContainerSelectors, 'makeSelectIncidentContainer').mockImplementation(() => ({ subcategoryPrediction: subcategory.slug }));
    const { findByTestId, queryByText } = render(withAppContext(<DescriptionInfo info="the-info" />));

    await findByTestId('descriptionInfo');
    expect(queryByText(`Subcategorie voorstel: ${subcategory.name}`)).not.toBeInTheDocument();
  });
});
