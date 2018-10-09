import mapCategories from './index';

describe('The mapCategories service', () => {
  it('by default should return empty categories', () => {
    expect(mapCategories()).toEqual({
      categories: [],
      subcacategories: []
    });
  });

  it('should map categories and subcategories', () => {
    expect(mapCategories({
      results: [
        {
          _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren' } },
          _display: 'Overlast van dieren',
          sub_categories: [
            {
              _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren' } },
              _display: 'Dode dieren'
            },
            {
              _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven' } },
              _display: 'Duiven (Overlast van dieren)'
            }
          ]
        },
        {
          _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair' } },
          _display: 'Wegen, verkeer, straatmeubilair',
          sub_categories: [
            {
              _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid' } },
              _display: 'Gladheid (Wegen, verkeer, straatmeubilair)'
            }
          ]
        }
      ]
    })).toEqual({
      categories: [
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
          value: 'Overlast van dieren',
        }, {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair',
          value: 'Wegen, verkeer, straatmeubilair',
        }
      ],
      subcacategories: [
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
          value: 'Dode dieren'
        },
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
          value: 'Duiven (Overlast van dieren)'
        },
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid',
          value: 'Gladheid (Wegen, verkeer, straatmeubilair)'
        }
      ]
    });
  });
});
