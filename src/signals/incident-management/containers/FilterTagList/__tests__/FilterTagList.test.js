import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { withAppContext, withIntlAppContext } from 'test/utils';
import categories from 'utils/__tests__/fixtures/categories.json';
import * as definitions from 'signals/incident-management/definitions';

import FilterTagList, {
  FilterTagListComponent,
  allLabelAppend,
  mapKeys,
} from '..';
import translations from '../../../../../translations/nl.json';

const dataLists = {
  priority: definitions.priorityList,
  status: definitions.statusList,
  feedback: definitions.feedbackList,
  stadsdeel: definitions.stadsdeelList,
  source: definitions.sourceList,
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

  describe('date formatting', () => {
    it('renders created before', () => {
      const { queryByText } = render(
        withIntlAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={{ ...tags, created_before: '2019-09-23' }}
            categories={categories}
          />,
          translations
        )
      );

      const createdBeforeLabel = 'Datum: t/m 23-09-2019';

      expect(queryByText(createdBeforeLabel)).toBeInTheDocument();
    });

    it('renders date after', () => {
      const { queryByText } = render(
        withIntlAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={{ ...tags, created_after: '2019-09-17' }}
            categories={categories}
          />,
          translations
        )
      );

      const createdAfterLabel = 'Datum: 17-09-2019 t/m nu';

      expect(queryByText(createdAfterLabel)).toBeInTheDocument();
    });

    it('renders both date after and date before', () => {
      const { queryByText } = render(
        withIntlAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={{
              ...tags,
              created_before: '2019-09-23',
              created_after: '2019-09-17',
            }}
            categories={categories}
          />,
          translations
        )
      );

      const createdBeforeAfterLabel = 'Datum: 17-09-2019 t/m 23-09-2019';

      expect(queryByText(createdBeforeAfterLabel)).toBeInTheDocument();
    });
  });

  describe('tags list', () => {
    const maincategory_slug = [
      {
        key:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
        value: 'Afval',
        slug: 'afval',
      },
    ];

    it('shows an extra label when a tag is a main category', () => {
      const { rerender, queryByText } = render(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={tags}
            categories={categories}
          />
        )
      );

      expect(
        queryByText(`${maincategory_slug[0].value}${allLabelAppend}`)
      ).toBeFalsy();

      const tagsWithMainCat = { ...tags, maincategory_slug };

      rerender(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={tagsWithMainCat}
            categories={categories}
          />
        )
      );

      expect(
        queryByText(`${maincategory_slug[0].value}${allLabelAppend}`)
      ).toBeTruthy();
    });

    it('renders a list of tags', () => {
      const { queryAllByTestId, queryByText } = render(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={tags}
            categories={categories}
          />
        )
      );

      expect(queryByText('Normaal')).toBeInTheDocument();
      expect(queryByText('Tevreden')).toBeInTheDocument();
      expect(queryByText('februariplein 1')).toBeInTheDocument();
      expect(queryByText('Centrum')).toBeInTheDocument();
      expect(queryByText('Westpoort')).toBeInTheDocument();
      expect(queryByText('Telefoon – Adoptant')).toBeInTheDocument();
      expect(queryByText('Telefoon – ASC')).toBeInTheDocument();

      expect(queryAllByTestId('filterTagListTag')).toHaveLength(10);
    });

    it('renders tags that have all items selected', () => {
      const groupedTags = {
        status: definitions.statusList,
        stadsdeel: definitions.stadsdeelList,
        source: definitions.sourceList,
      };

      const { queryByText } = render(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            tags={groupedTags}
            categories={categories}
          />
        )
      );

      expect(queryByText(`status${allLabelAppend}`)).toBeInTheDocument();
      expect(queryByText(`stadsdeel${allLabelAppend}`)).toBeInTheDocument();
      expect(queryByText(`bron${allLabelAppend}`)).toBeInTheDocument();
    });

    it('renders no list when tags are undefined', () => {
      const { queryAllByTestId } = render(
        withAppContext(
          <FilterTagListComponent
            dataLists={dataLists}
            categories={categories}
          />
        )
      );

      expect(queryAllByTestId('filterTagListTag')).toHaveLength(0);
    });
  });

  it('should map keys', () => {
    expect(mapKeys('source')).toEqual('bron');
    expect(mapKeys('any_key')).toEqual('any_key');
  });
});
