import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import SearchBarContainer, { SearchBarComponent } from '..';

describe('containers/SearchBar', () => {
  afterEach(cleanup);

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<SearchBarContainer />));

    const props = tree.find(SearchBarComponent).props();

    expect(props.onResetSearchIncidents).toBeDefined();
    expect(props.onRequestIncidents).toBeDefined();
    expect(props.onSearchIncidents).toBeDefined();
    expect(props.query).toBeDefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<SearchBarContainer />));

    const containerProps = tree.find(SearchBarComponent).props();

    expect(containerProps.onResetSearchIncidents).toBeDefined();
    expect(typeof containerProps.onRequestIncidents).toEqual('function');

    expect(containerProps.onRequestIncidents).toBeDefined();
    expect(typeof containerProps.onRequestIncidents).toEqual('function');

    expect(containerProps.onApplyFilter).toBeDefined();
    expect(typeof containerProps.onApplyFilter).toEqual('function');

    expect(containerProps.onSearchIncidents).toBeDefined();
    expect(typeof containerProps.onSearchIncidents).toEqual('function');

    expect(containerProps.history).toBeDefined();
    expect(typeof containerProps.history.push).toEqual('function');
  });

  describe('callback handlers', () => {
    const onResetSearchIncidents = jest.fn();
    const onRequestIncidents = jest.fn();
    const onSearchIncidents = jest.fn();
    const onApplyFilter = jest.fn();

    afterEach(jest.resetAllMocks);

    it('should call searchSubmit handler', () => {
      const query = '';
      const push = jest.fn();
      const history = { push };

      const { queryByTestId } = render(
        withAppContext(
          <SearchBarComponent
            onResetSearchIncidents={onResetSearchIncidents}
            onRequestIncidents={onRequestIncidents}
            onSearchIncidents={onSearchIncidents}
            onApplyFilter={onApplyFilter}
            query={query}
            history={history}
          />,
        ),
      );

      const formInput = queryByTestId('searchBar').querySelector('input');
      const formSubmitBtn = queryByTestId('searchBar').querySelector('button');

      fireEvent.change(formInput, { target: { value: '1234' } });

      expect(push).not.toHaveBeenCalled();
      expect(onSearchIncidents).not.toHaveBeenCalled();
      expect(onApplyFilter).not.toHaveBeenCalled();

      fireEvent.click(formSubmitBtn);

      expect(push).toHaveBeenCalledWith('/manage/incidents');
      expect(onSearchIncidents).toHaveBeenCalledWith('1234');
      expect(onApplyFilter).toHaveBeenCalledWith({});
    });

    it('should call onChange handler', () => {
      const query = 'Foo baz barrr';
      const push = jest.fn();
      const history = { push };

      const { queryByTestId } = render(
        withAppContext(
          <SearchBarComponent
            onResetSearchIncidents={onResetSearchIncidents}
            onRequestIncidents={onRequestIncidents}
            onSearchIncidents={onSearchIncidents}
            onApplyFilter={onApplyFilter}
            query={query}
            history={history}
          />,
        ),
      );

      expect(onRequestIncidents).not.toHaveBeenCalled();

      const formInput = queryByTestId('searchBar').querySelector('input');
      fireEvent.change(formInput, { target: { value: '' } });

      expect(push).not.toHaveBeenCalled();
      expect(onResetSearchIncidents).toHaveBeenCalledWith();
      expect(onRequestIncidents).toHaveBeenCalledWith();
    });
  });
});
