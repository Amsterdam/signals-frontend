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
          slug: 'overlast-van-dieren',
          _display: 'Overlast van dieren',
          sub_categories: [
            {
              slug: 'dode-dieren',
              _display: 'Dode dieren'
            },
            {
              slug: 'duiven',
              _display: 'Duiven (Overlast van dieren)'
            }
          ]
        },
        {
          slug: 'wegen-verkeer-straatmeubilair',
          _display: 'Wegen, verkeer, straatmeubilair',
          sub_categories: [
            {
              slug: 'gladheid',
              _display: 'Gladheid (Wegen, verkeer, straatmeubilair)'
            }
          ]
        }
      ]
    })).toEqual({
      categories: [
        {
          key: 'overlast-van-dieren',
          value: 'Overlast van dieren',
        }, {
          key: 'wegen-verkeer-straatmeubilair',
          value: 'Wegen, verkeer, straatmeubilair',
        }
      ],
      subcacategories: [
        {
          key: 'dode-dieren',
          value: 'Dode dieren',
          parent: 'overlast-van-dieren'
        },
        {
          key: 'duiven',
          value: 'Duiven (Overlast van dieren)',
          parent: 'overlast-van-dieren'
        },
        {
          key: 'gladheid',
          value: 'Gladheid (Wegen, verkeer, straatmeubilair)',
          parent: 'wegen-verkeer-straatmeubilair'
        }
      ]
    });
  });
});
