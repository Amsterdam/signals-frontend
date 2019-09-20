import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { withAppContext, withIntlAppContext } from 'test/utils';
import categories from 'utils/__tests__/fixtures/categories.json';

import FilterTagList, { FilterTagListComponent, allLabelAppend } from '../';
import definitions from '../../../definitions';
import translations from '../../../../../translations/nl.json';

describe('signals/incident-management/containers/FilterTagList', () => {
  const overviewpage = {
    ...definitions,
  };

  const tags = {
    status: ['m'],
    feedback: '',
    priority: 'normal',
    stadsdeel: ['A', 'T'],
    address_text: '',
    incident_date: '2019-09-17',
    category_slug: ['oever-kade-steiger'],
  };

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<FilterTagList />));

    const props = tree.find(FilterTagListComponent).props();

    expect(props.overviewpage).not.toBeUndefined();
    expect(props.categories).not.toBeUndefined();
  });

  it('should skip fields', () => {
    const id = 'foo-bar-baz';
    const tagsWithId = Object.assign({}, tags, { id });

    const { queryByText } = render(
      withAppContext(
        <FilterTagListComponent
          overviewpage={overviewpage}
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
          overviewpage={overviewpage}
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
    const maincategory_slug = 'openbaar-groen-en-water';

    it('shows an extra label when a tag is a main category', () => {
      const { rerender, queryByText } = render(
        withAppContext(
          <FilterTagListComponent
            overviewpage={overviewpage}
            tags={tags}
            categories={categories}
          />,
        ),
      );

      const mainCat = categories.main.find(
        ({ slug }) => slug === maincategory_slug,
      );

      expect(queryByText(`${mainCat.value}${allLabelAppend}`)).toBeFalsy();

      const tagsWithMainCat = Object.assign({}, tags, {
        maincategory_slug: [maincategory_slug],
      });

      rerender(
        withAppContext(
          <FilterTagListComponent
            overviewpage={overviewpage}
            tags={tagsWithMainCat}
            categories={categories}
          />,
        ),
      );

      expect(queryByText(`${mainCat.value}${allLabelAppend}`)).toBeTruthy();
    });

    it('renders a list of tags', () => {
      const { container } = render(
        withAppContext(
          <FilterTagListComponent
            overviewpage={overviewpage}
            tags={tags}
            categories={categories}
          />,
        ),
      );

      expect(container.querySelectorAll('span')).toHaveLength(6);
    });
  });
});
