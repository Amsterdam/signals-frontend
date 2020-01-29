import priorityList from 'signals/incident-management/definitions/priorityList';
import statusList from 'signals/incident-management/definitions/statusList';
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import categories from 'utils/__tests__/fixtures/categories.json';

import {
  parseOutputFormData,
  parseInputFormData,
  parseToAPIData,
} from '../parse';

describe('signals/shared/parse', () => {
  const dataLists = {
    stadsdeel: stadsdeelList,
    maincategory_slug: categories.main,
    priority: priorityList,
    status: statusList,
    category_slug: categories.sub,
  };

  describe('parseOutputFormData', () => {
    it('should parse output FormData', () => {
      const mainCategories = categories.main.filter(
        ({ slug }) =>
          slug === 'afval' || slug === 'wegen-verkeer-straatmeubilair'
      );
      const subCategories = categories.sub.filter(
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
  });

  describe('parseInputFormData', () => {
    const input = {
      name: 'Afval in Westpoort',
      options: {
        stadsdeel: ['B'],
        address_text: '',
        maincategory_slug: ['afval'],
        category_slug: ['maaien-snoeien', 'onkruid', 'autom-verzinkbare-palen'],
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
        maincategory_slug: [
          {
            key:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
            slug: 'afval',
            value: 'Afval',
          },
        ],
        category_slug: [
          {
            key:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/maaien-snoeien',
            value: 'Maaien / snoeien',
            slug: 'maaien-snoeien',
            category_slug: 'openbaar-groen-en-water',
            handling_message:
              '\nUw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          },
          {
            key:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/onkruid',
            value: 'Onkruid',
            slug: 'onkruid',
            category_slug: 'openbaar-groen-en-water',
            handling_message:
              '\nUw melding wordt ingepland: wij laten u binnen 5 werkdagen weten hoe en wanneer uw melding wordt afgehandeld. Dat doen we via e-mail.',
          },
          {
            key:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/autom-verzinkbare-palen',
            value: 'Autom. Verzinkbare palen',
            slug: 'autom-verzinkbare-palen',
            category_slug: 'wegen-verkeer-straatmeubilair',
            handling_message:
              '\nWij handelen uw melding binnen drie weken af. U ontvangt dan geen apart bericht meer.\nEn anders hoort u - via e-mail - wanneer wij uw melding kunnen oppakken.',
          },
        ],
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
