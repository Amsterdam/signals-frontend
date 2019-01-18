import mapCategories from './index';

describe('The mapCategories service', () => {
  it('by default should return empty categories', () => {
    expect(mapCategories()).toEqual({
      main: [],
      sub: [],
      mainToSub: {}
    });
  });

  it('should map categories and subcategories', () => {
    expect(mapCategories({
      results: [
        {
          _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren' } },
          name: 'Overlast van dieren',
          slug: 'overlast-van-dieren',
          sub_categories: [
            {
              _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren' } },
              name: 'Dode dieren',
              slug: 'dode-dieren'
            },
            {
              _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven' } },
              name: 'Duiven',
              slug: 'duiven'
            }
          ]
        },
        {
          _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair' } },
          name: 'Wegen, verkeer, straatmeubilair',
          slug: 'wegen-verkeer-straatmeubilair',
          sub_categories: [
            {
              _links: { self: { href: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid' } },
              name: 'Gladheid',
              slug: 'gladheid'
            }
          ]
        }
      ]
    })).toEqual({
      main: [
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
          value: 'Overlast van dieren',
          slug: 'overlast-van-dieren'
        }, {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair',
          value: 'Wegen, verkeer, straatmeubilair',
          slug: 'wegen-verkeer-straatmeubilair'
        }
      ],
      sub: [
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
          value: 'Dode dieren',
          slug: 'dode-dieren'
        },
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
          value: 'Duiven',
          slug: 'duiven'
        },
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid',
          value: 'Gladheid',
          slug: 'gladheid'
        }
      ],
      mainToSub: {
        '': [
          'dode-dieren',
          'duiven',
          'gladheid'
        ],
        'overlast-van-dieren': [
          'dode-dieren',
          'duiven'
        ],
        'wegen-verkeer-straatmeubilair': [
          'gladheid'
        ]
      }
    });
  });
});
