import priorityList from 'signals/incident-management/definitions/priorityList';
import statusList from 'signals/incident-management/definitions/statusList';
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import categories from 'utils/__tests__/fixtures/categories.json';

import {
  parseOutputFormData,
  parseInputFormData,
  parseFromAPIData,
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
      const form = document.createElement('form');
      const nameField = document.createElement('input');
      nameField.setAttribute('type', 'text');
      nameField.setAttribute('name', 'name');
      nameField.setAttribute('value', 'Afval in Westpoort');
      nameField.checked = true;
      form.appendChild(nameField);

      const toggle = document.createElement('input');
      toggle.setAttribute('type', 'checkbox');
      toggle.setAttribute('name', 'maincategory_slug');
      toggle.setAttribute('value', 'afval');
      toggle.checked = true;
      form.appendChild(toggle);

      const individualCheckbox1 = document.createElement('input');
      individualCheckbox1.setAttribute('type', 'checkbox');
      individualCheckbox1.setAttribute('name', 'drijfvuil_category_slug');
      individualCheckbox1.setAttribute('value', 'drijfvuil');
      individualCheckbox1.checked = true;
      form.appendChild(individualCheckbox1);

      const expected1 = {
        name: 'Afval in Westpoort',
        refresh: false,
        options: {
          maincategory_slug: ['afval'],
          category_slug: ['drijfvuil'],
        },
      };

      const parsedOutput1 = parseOutputFormData(form);

      expect(parsedOutput1).toEqual(expected1);

      const individualCheckbox2 = document.createElement('input');
      individualCheckbox2.setAttribute('type', 'checkbox');
      individualCheckbox2.setAttribute('name', 'maaien-snoeien_category_slug');
      individualCheckbox2.setAttribute('value', 'maaien-snoeien');
      individualCheckbox2.checked = true;
      form.appendChild(individualCheckbox2);

      const individualCheckbox3 = document.createElement('input');
      individualCheckbox3.setAttribute('type', 'checkbox');
      individualCheckbox3.setAttribute('name', 'maaien-snoeien_category_slug');
      individualCheckbox3.setAttribute('value', 'maaien-snoeien-2');
      individualCheckbox3.checked = true;
      form.appendChild(individualCheckbox3);

      const toggle2 = document.createElement('input');
      toggle2.setAttribute('type', 'checkbox');
      toggle2.setAttribute('name', 'maincategory_slug');
      toggle2.setAttribute('value', 'wegen-verkeer-straatmeubilair');
      toggle2.checked = true;
      form.appendChild(toggle2);

      const expected2 = {
        name: 'Afval in Westpoort',
        refresh: false,
        options: {
          maincategory_slug: ['afval', 'wegen-verkeer-straatmeubilair'],
          category_slug: ['drijfvuil', 'maaien-snoeien', 'maaien-snoeien-2'],
        },
      };

      const parsedOutput2 = parseOutputFormData(form);

      expect(parsedOutput2).toEqual(expected2);
    });

    it('should format date values', () => {
      const form = document.createElement('form');
      const dateCreatedBefore = document.createElement('input');
      dateCreatedBefore.name = 'created_before';
      dateCreatedBefore.setAttribute('value', '2019-12-19');
      form.appendChild(dateCreatedBefore);

      const dateCreatedAfter = document.createElement('input');
      dateCreatedAfter.name = 'created_after';
      dateCreatedAfter.setAttribute('value', '2019-12-10');
      form.appendChild(dateCreatedAfter);

      const expected = {
        refresh: false,
        options: {
          created_before: '2019-12-19T23:59:59',
          created_after: '2019-12-10T00:00:00',
        },
      };

      const parsedOutput = parseOutputFormData(form);

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
        category_slug: [
          'maaien-snoeien',
          'onkruid',
          'autom-verzinkbare-palen',
        ],
      },
    };

    const output = {
      name: 'Afval in Westpoort',
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
    };

    it('should parse input FormData', () => {
      const parsedInput = parseInputFormData(input, dataLists);

      expect(parsedInput).toEqual(output);
    });

    it('should return an empty object', () => {
      expect(parseInputFormData({}, dataLists)).toEqual({});
      expect(parseInputFormData({ options: {} }, dataLists)).toEqual({});
    });

    describe('parseFromAPIData', () => {
      it('should return an object', () => {
        // empty API data equals the default initial state value for activeFilter
        const emptyAPIData = {
          name: '',
          options: {},
        };

        const undefinedValues = { id: undefined, refresh: undefined };

        const expected = { ...undefinedValues, ...emptyAPIData };

        expect(parseFromAPIData(emptyAPIData, dataLists)).toEqual(expected);

        const expectedOutput = { options: output, name: input.name };
        delete expectedOutput.options.name;

        expect(parseFromAPIData(input, dataLists)).toEqual(expectedOutput);
      });
    });

    describe('parseToAPIData', () => {
      it('should return an object', () => {
        const filterData = { id: 123, name: 'foo' };

        expect(parseToAPIData(filterData)).toEqual({ options: {}, id: 123, name: 'foo' });

        filterData.options = output;
        delete filterData.options.name;

        expect(parseToAPIData(filterData)).toEqual({ ...input, id: 123, name: 'foo' });
      });
    });
  });
});
