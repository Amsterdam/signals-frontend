import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { withAppContext, withIntlAppContext } from 'test/utils';
import categories from 'utils/__tests__/fixtures/categories.json';
import * as definitions from 'signals/incident-management/definitions';

import FilterTagList, { FilterTagListComponent, allLabelAppend } from '..';
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
    feedback: 'satisfied',
    priority: 'normal',
    stadsdeel: [definitions.stadsdeelList[0], definitions.stadsdeelList[1]],
    address_text: 'februariplein 1',
    incident_date: '2019-09-17',
    source: [definitions.sourceList[0], definitions.sourceList[1]],
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

      const tagsWithMainCat = { ...tags, maincategory_slug };

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
      const { container, queryByText } = render(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={tags}
            categories={categories}
          />,
        ),
      );

      expect(queryByText('Normaal')).toBeTruthy();
      expect(queryByText('Tevreden')).toBeTruthy();
      expect(queryByText('februariplein 1')).toBeTruthy();
      expect(queryByText('Centrum')).toBeTruthy();
      expect(queryByText('Westpoort')).toBeTruthy();
      expect(queryByText('Telefoon – Adoptant')).toBeTruthy();
      expect(queryByText('Telefoon – ASC')).toBeTruthy();

      expect(container.querySelectorAll('span')).toHaveLength(10);
    });

    it('renders no list when tags are undefined', () => {
      const { container } = render(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            categories={categories}
          />,
        ),
      );

      expect(container.querySelectorAll('span')).toHaveLength(0);
    });
  });
});
