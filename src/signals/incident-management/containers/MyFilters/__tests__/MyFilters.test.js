import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import MyFilters, { MyFiltersComponent } from '../';

describe('signals/incident-management/containers/MyFilters', () => {
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<MyFilters onClose={() => {}} />));

    const props = tree.find(MyFiltersComponent).props();

    expect(props.allFilters).not.toBeUndefined();
    expect(props.onApplyFilter).not.toBeUndefined();
    expect(props.onRemoveFilter).not.toBeUndefined();
  });

  it('should show a message when there are no filters', () => {
    const { container } = render(
      withAppContext(
        <MyFiltersComponent
          onClose={() => {}}
          allFilters={[]}
          onApplyFilter={() => {}}
          onRemoveFilter={() => {}}
        />,
      ),
    );

    expect(container.querySelector('.my-filters--empty')).toBeTruthy();
  });

  it('should sort filters by name', () => {
    const filter1 = {
      id: 1234,
      name: 'Foo bar baz',
      options: {
        status: ['m'],
        feedback: '',
        priority: 'normal',
        stadsdeel: ['A', 'T'],
        address_text: '',
        incident_date: '2019-09-17',
        category_slug: ['oever-kade-steiger'],
      },
    };
    const filter2 = {
      id: 1235,
      name: 'Bar bar baz',
      options: {
        status: ['m'],
        feedback: '',
        priority: 'normal',
        stadsdeel: ['A', 'T'],
        address_text: '',
        incident_date: '2019-09-17',
        category_slug: ['oever-kade-steiger'],
      },
    };
    const sortSpy = jest.spyOn(Array.prototype, 'sort');
    const allFilters = [filter1, filter2];
    const { getByText } = render(
      withAppContext(
        <MyFiltersComponent
          onClose={() => {}}
          allFilters={allFilters}
          onApplyFilter={() => {}}
          onRemoveFilter={() => {}}
        />,
      ),
    );

    expect(sortSpy).toHaveBeenCalled();

    const firstFilter = getByText(filter1.name).closest('.filter-item');
    const secondFilter = getByText(filter2.name).closest('.filter-item');
    const myFilterChildNodes = Array.from(document.querySelector('.my-filters').childNodes);

    const firstIndex = myFilterChildNodes.indexOf(firstFilter);
    const secondIndex = myFilterChildNodes.indexOf(secondFilter);

    expect(firstIndex).toBeGreaterThan(secondIndex);
  });
});
