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

    const containerProps = tree.find(SearchBarComponent).props();

    expect(containerProps.onRequestIncidents).not.toBeUndefined();
    expect(typeof containerProps.onRequestIncidents).toEqual('function');

    expect(containerProps.onApplyFilter).not.toBeUndefined();
    expect(typeof containerProps.onApplyFilter).toEqual('function');

    expect(containerProps.onSetSearchQuery).not.toBeUndefined();
    expect(typeof containerProps.onSetSearchQuery).toEqual('function');

    expect(containerProps.history).not.toBeUndefined();
    expect(typeof containerProps.history.push).toEqual('function');
  });

  describe('callback handlers', () => {
    const onRequestIncidents = jest.fn();
    const onSetSearchQuery = jest.fn();
    const onApplyFilter = jest.fn();

    afterEach(jest.resetAllMocks);

    it('should call searchSubmit handler', () => {
      const query = '';
      const push = jest.fn();
      const history = { push };

      const { queryByTestId } = render(
        withAppContext(
          <SearchBarComponent
            onRequestIncidents={onRequestIncidents}
            onSetSearchQuery={onSetSearchQuery}
            onApplyFilter={onApplyFilter}
            query={query}
            history={history}
          />,
        ),
      );

      const formInput = queryByTestId('searchBar').querySelector('input');
      const formSubmitBtn = queryByTestId('searchBar').querySelector('button');

      fireEvent.change(formInput, { target: { value: '1234' } });
      fireEvent.click(formSubmitBtn);

      expect(push).toHaveBeenCalledWith('/manage/incidents');
      expect(onRequestIncidents).toHaveBeenCalledWith();
      expect(onSetSearchQuery).toHaveBeenCalledWith('1234');
      expect(onApplyFilter).toHaveBeenCalledWith({});
    });

    it('should call onChange handler', () => {
      const query = 'Foo baz barrr';
      const push = jest.fn();
      const history = { push };

      const { queryByTestId } = render(
        withAppContext(
          <SearchBarComponent
            onRequestIncidents={onRequestIncidents}
            onSetSearchQuery={onSetSearchQuery}
            onApplyFilter={onApplyFilter}
            query={query}
            history={history}
          />,
        ),
      );

      const formInput = queryByTestId('searchBar').querySelector('input');
      fireEvent.change(formInput, { target: { value: '' } });

      expect(push).not.toHaveBeenCalled();
      expect(onSetSearchQuery).toHaveBeenCalledWith('');
      expect(onRequestIncidents).toHaveBeenCalledWith();
    });
  });
});
