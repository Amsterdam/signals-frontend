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

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<SearchBarContainer />));

    const containerProps = tree
      .find(SearchBarComponent)
      .props();

    expect(containerProps.onRequestIncidents).not.toBeUndefined();
    expect(typeof containerProps.onRequestIncidents).toEqual('function');

    expect(containerProps.onApplyFilter).not.toBeUndefined();
    expect(typeof containerProps.onApplyFilter).toEqual('function');

    expect(containerProps.onSetSearchQuery).not.toBeUndefined();
    expect(typeof containerProps.onSetSearchQuery).toEqual('function');
  });

  it('should call searchSubmit handler', () => {
    const onRequestIncidents = jest.fn();
    const onSetSearchQuery = jest.fn();
    const onApplyFilter = jest.fn();
    const query = '';

    const { queryByTestId } = render(
      withAppContext(
        <SearchBarComponent
          onRequestIncidents={onRequestIncidents}
          onSetSearchQuery={onSetSearchQuery}
          onApplyFilter={onApplyFilter}
          query={query}
        />,
      ),
    );

    const formInput = queryByTestId('searchBar').querySelector('input');
    const formSubmitBtn = queryByTestId('searchBar').querySelector('button');

    fireEvent.change(formInput, { target: { value: '1234' } });
    fireEvent.click(formSubmitBtn);

    expect(onRequestIncidents).toHaveBeenCalledWith();
    expect(onSetSearchQuery).toHaveBeenCalledWith('1234');
    expect(onApplyFilter).toHaveBeenCalledWith({});
  });
});
