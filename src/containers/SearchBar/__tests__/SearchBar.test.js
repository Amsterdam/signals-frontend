import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import SearchBarContainer, { SearchBarComponent } from '../';

describe('containers/SearchBar', () => {
  afterEach(cleanup);

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<SearchBarContainer />));

    const props = tree.find(SearchBarComponent).props();

    expect(props.onRequestIncidents).toBeDefined();
    expect(props.onSetSearchQuery).toBeDefined();
    expect(props.query).toBeDefined();
  });

  it('should call searchSubmit handler', () => {
    const onRequestIncidents = jest.fn();
    const onSetSearchQuery = jest.fn();
    const query = '';

    const { queryByTestId } = render(
      withAppContext(
        <SearchBarComponent
          onRequestIncidents={onRequestIncidents}
          onSetSearchQuery={onSetSearchQuery}
          query={query}
        />,
      ),
    );

    const formInput = queryByTestId('searchBar').querySelector('input');
    const formSubmitBtn = queryByTestId('searchBar').querySelector('button');

    fireEvent.change(formInput, { target: { value: '1234' } });
    fireEvent.click(formSubmitBtn);

    expect(onRequestIncidents).toHaveBeenCalled();
    expect(onSetSearchQuery).toHaveBeenCalled();
  });
});
