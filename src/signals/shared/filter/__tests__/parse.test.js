import priorityList from 'signals/incident-management/definitions/priorityList';
import statusList from 'signals/incident-management/definitions/statusList';
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import categories from 'utils/__tests__/fixtures/categories_private.json';
import { filterForSub, filterForMain } from 'models/categories/selectors';

import {
  parseOutputFormData,
  parseInputFormData,
  parseToAPIData,
} from '../parse';

const filteredSubCategories = categories.results.filter(filterForSub);
const filteredMainCategories = categories.results.filter(filterForMain);

describe('signals/shared/parse', () => {
  const dataLists = {
    stadsdeel: stadsdeelList,
    maincategory_slug: filteredMainCategories,
    priority: priorityList,
    status: statusList,
    category_slug: filteredSubCategories,
  };

  describe('parseOutputFormData', () => {
    it('should parse output FormData', () => {
      const mainCategories = filteredMainCategories.filter(
        ({ slug }) =>
          slug === 'afval' || slug === 'wegen-verkeer-straatmeubilair'
      );
      const subCategories = filteredSubCategories.filter(
        ({ slug }) => slug === 'drijfvuil' || slug === 'maaien-snoeien'
      );
      const stadsdeel = stadsdeelList.filter(
        ({ key }) => key === 'A' || key === 'B'
      );

      const formState = {
        unparsed_key: 'Not parsed',
        maincategory_slug: mainCategories,
        category_slug: subCategories,
        stadsdeel,
      };

      const expected = {
        unparsed_key: 'Not parsed',
        maincategory_slug: mainCategories.map(({ slug }) => slug),
        category_slug: subCategories.map(({ slug }) => slug),
        stadsdeel: stadsdeel.map(({ key }) => key),
      };

      const parsedOutput = parseOutputFormData(formState);

      expect(parsedOutput).toEqual(expected);
    });

    it('should format date values', () => {
      const formState = {
        created_before: '2019-12-19',
        created_after: '2019-12-10',
      };
      const expected = {
        created_before: '2019-12-19T23:59:59',
        created_after: '2019-12-10T00:00:00',
      };

      const parsedOutput = parseOutputFormData(formState);

      expect(parsedOutput).toEqual(expected);
    });

    it('should not format invalid date values', () => {
      const formState = {
        created_before: null,
        created_after: 'this is not a date',
      };
      const expected = {
        created_before: undefined,
        created_after: undefined,
      };

      const parsedOutput = parseOutputFormData(formState);

      expect(parsedOutput).toEqual(expected);
    });

    it('should return non-empty values', () => {
      const formState = {
        priority: [priorityList[0]],
        stadsdeel: [],
      };

      const expected = {
        priority: [priorityList[0].key],
      };

      const parsedOutput = parseOutputFormData(formState);

      expect(parsedOutput).toEqual(expected);
    });
  });

  describe('parseInputFormData', () => {
    const subSlugs = ['maaien-snoeien', 'onkruid', 'autom-verzinkbare-palen'].sort();
    const input = {
      name: 'Afval in Westpoort',
      options: {
        stadsdeel: ['B'],
        address_text: '',
        maincategory_slug: ['afval'],
        category_slug: subSlugs,
      },
    };

    const output = {
      name: 'Afval in Westpoort',
      options: {
        stadsdeel: [
          {
            key: 'B',
            value: 'Westpoort',
          },
        ],
        address_text: '',
        maincategory_slug: filteredMainCategories.filter(
          ({ slug }) => slug === 'afval'
        ),
        category_slug: filteredSubCategories.filter(
          ({ slug }) => subSlugs.includes(slug)
        ),
      },
    };

    it('should parse input FormData', () => {
      const parsedInput = parseInputFormData(input, dataLists);

      expect(parsedInput).toEqual(output);
    });

    it('should return an empty object', () => {
      expect(parseInputFormData({}, dataLists)).toEqual({ options: {} });
      expect(parseInputFormData({ options: {} }, dataLists)).toEqual({
        options: {},
      });
    });

    describe('parseToAPIData', () => {
      it('should return an object', () => {
        const filterData = { id: 123, name: 'foo' };

        expect(parseToAPIData(filterData)).toEqual({
          options: {},
          id: 123,
          name: 'foo',
        });

        filterData.options = output.options;

        expect(parseToAPIData(filterData)).toEqual({
          ...input,
          id: 123,
          name: 'foo',
        });
      });
    });
  });
});
