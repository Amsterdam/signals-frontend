import priorityList from 'signals/incident-management/definitions/priorityList';
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import categories from 'utils/__tests__/fixtures/categories_private.json';
import { filterForSub, filterForMain } from 'models/categories/selectors';
import dataLists from 'signals/incident-management/definitions';

import { parseOutputFormData, parseInputFormData, parseToAPIData } from '../parse';

const filteredSubCategories = categories.results.filter(filterForSub);
const filteredMainCategories = categories.results.filter(filterForMain);

describe('signals/shared/filter/parse', () => {
  describe('parseOutputFormData', () => {
    it('should parse output FormData', () => {
      const mainCategories = filteredMainCategories.filter(
        ({ slug }) => slug === 'afval' || slug === 'wegen-verkeer-straatmeubilair'
      );
      const subCategories = filteredSubCategories.filter(
        ({ slug }) => slug === 'drijfvuil' || slug === 'maaien-snoeien'
      );
      const stadsdeel = stadsdeelList.filter(({ key }) => key === 'A' || key === 'B');

      const formState = {
        unparsed_key: 'Not parsed',
        maincategory_slug: mainCategories,
        category_slug: subCategories,
        stadsdeel,
        contact_details: [dataLists.contact_details[0]],
      };

      const expected = {
        unparsed_key: 'Not parsed',
        maincategory_slug: mainCategories.map(({ slug }) => slug),
        category_slug: subCategories.map(({ slug }) => slug),
        stadsdeel: stadsdeel.map(({ key }) => key),
        contact_details: [dataLists.contact_details[0].key],
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

    const maincategory_slug = filteredMainCategories.filter(({ slug }) => slug === 'afval');

    const category_slug = filteredSubCategories.filter(({ slug }) => subSlugs.includes(slug));

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
      expect(parseInputFormData(input)).toEqual({
        name: 'Afval in Westpoort',
        options: {
          stadsdeel: [
            {
              key: 'B',
              value: 'Westpoort',
            },
          ],
          address_text: '',
          maincategory_slug: [],
          category_slug: [],
        },
      });

      expect(parseInputFormData(input, { maincategory_slug, category_slug })).toEqual(output);
    });

    it('should return an empty object', () => {
      expect(parseInputFormData({}, { maincategory_slug, category_slug })).toEqual({ options: {} });
      expect(parseInputFormData({ options: {} }, dataLists)).toEqual({
        options: {},
      });
    });

    it('should skip slugs that do not have a match in the list of categories', () => {
      // Categories can be made inactive; those are filtered out when the full list is
      // retrieved from the API. However, there can still be stored filters with those
      // inactive categories.
      const inactiveSlug = 'autom-verzinkbare-palen';
      const catSlug = category_slug.filter(({ slug }) => slug !== inactiveSlug);
      const parsedInput = parseInputFormData(input, { maincategory_slug, category_slug: catSlug });
      const outputSlugs = parsedInput.options.category_slug.map(({ slug }) => slug);

      expect(outputSlugs).not.toContain(inactiveSlug);
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
