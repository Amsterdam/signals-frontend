import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { withAppContext, withIntlAppContext } from 'test/utils';
import categories from 'utils/__tests__/fixtures/categories.json';
import * as definitions from 'signals/incident-management/definitions';

import FilterTagList, { FilterTagListComponent, allLabelAppend } from '../';
import translations from '../../../../../translations/nl.json';

const dataLists = {
  priority: definitions.priorityList,
  status: definitions.statusList,
  feedback: definitions.feedbackList,
  stadsdeel: definitions.stadsdeelList,
};

describe('signals/incident-management/containers/FilterTagList', () => {
  const tags = {
    status: [definitions.statusList[1]],
    feedback: '',
    priority: 'normal',
    stadsdeel: [definitions.stadsdeelList[0], definitions.stadsdeelList[1]],
    address_text: '',
    incident_date: '2019-09-17',
    category_slug: [
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
        value: 'Asbest / accu',
        slug: 'asbest-accu',
      },
    ],
  };

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<FilterTagList />));

    const props = tree.find(FilterTagListComponent).props();

    expect(props.dataLists).not.toBeUndefined();
    expect(props.categories).not.toBeUndefined();
  });

  it('should skip fields', () => {
    const id = 'foo-bar-baz';
    const tagsWithId = Object.assign({}, tags, { id });

    const { queryByText } = render(
      withAppContext(
        <FilterTagListComponent
          dataLists={dataLists}
          tags={tagsWithId}
          categories={categories}
        />,
      ),
    );

    expect(queryByText(id)).toBeFalsy();
  });

  it('formats a date value', () => {
    const { queryByText } = render(
      withIntlAppContext(
        <FilterTagListComponent
          dataLists={dataLists}
          tags={tags}
          categories={categories}
        />,
        translations,
      ),
    );

    expect(queryByText(tags.incident_date)).toBeFalsy();
    expect(queryByText('17-09-2019')).toBeTruthy();
  });

  describe('tags list', () => {
    const maincategory_slug = [{
      key:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
      value: 'Afval',
      slug: 'afval',
    }];

    it('shows an extra label when a tag is a main category', () => {
      const { rerender, queryByText } = render(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={tags}
            categories={categories}
          />,
        ),
      );

      expect(
        queryByText(`${maincategory_slug[0].value}${allLabelAppend}`),
      ).toBeFalsy();

      const tagsWithMainCat = Object.assign({}, tags, {
        maincategory_slug,
      });

      rerender(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={tagsWithMainCat}
            categories={categories}
          />,
        ),
      );

      expect(
        queryByText(`${maincategory_slug[0].value}${allLabelAppend}`),
      ).toBeTruthy();
    });

    it('renders a list of tags', () => {
      const { container } = render(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={tags}
            categories={categories}
          />,
        ),
      );

      expect(container.querySelectorAll('span')).toHaveLength(6);
    });
  });
});
