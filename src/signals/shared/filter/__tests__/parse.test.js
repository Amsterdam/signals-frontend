import priorityList from 'signals/incident-management/definitions/priorityList';
import statusList from 'signals/incident-management/definitions/statusList';
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import { mainCategories, subCategories } from 'utils/__tests__/fixtures';

import {
  parseOutputFormData,
  parseInputFormData,
  parseToAPIData,
} from '../parse';

describe('signals/shared/parse', () => {
  const dataLists = {
    stadsdeel: stadsdeelList,
    maincategory_slug: mainCategories,
    priority: priorityList,
    status: statusList,
    category_slug: subCategories,
  };

  describe('parseOutputFormData', () => {
    it('should parse output FormData', () => {
      const maincategory_slug = mainCategories.filter(
        ({ slug }) =>
          slug === 'afval' || slug === 'wegen-verkeer-straatmeubilair'
      );
      const category_slug = subCategories.filter(
        ({ slug }) => slug === 'drijfvuil' || slug === 'maaien-snoeien'
      );
      const stadsdeel = stadsdeelList.filter(
        ({ key }) => key === 'A' || key === 'B'
      );

      const formState = {
        unparsed_key: 'Not parsed',
        maincategory_slug,
        category_slug,
        stadsdeel,
      };

      const expected = {
        unparsed_key: 'Not parsed',
        maincategory_slug: maincategory_slug.map(({ slug }) => slug),
        category_slug: category_slug.map(({ slug }) => slug),
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
  });

  describe('parseInputFormData', () => {
    const mainCatSlug = 'afval';
    const maincategory_slug = mainCategories.filter(
      ({ slug }) => slug === mainCatSlug
    );
    const subCatSlugs = [
      'onkruid',
      'maaien-snoeien',
      'autom-verzinkbare-palen',
    ];

    const category_slug = subCategories.filter(({ slug }) =>
      subCatSlugs.includes(slug)
    );

    const input = {
      name: 'Afval in Westpoort',
      options: {
        stadsdeel: ['B'],
        address_text: '',
        maincategory_slug: [mainCatSlug],
        category_slug: category_slug.map(({ slug }) => slug),
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
        maincategory_slug,
        category_slug,
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
