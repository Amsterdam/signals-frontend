// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import mapCategories from '.';

describe('The mapCategories service', () => {
  it('by default should return empty categories', () => {
    expect(mapCategories()).toEqual({
      main: [],
      sub: [],
      mainToSub: {},
    });
  });

  it('should map categories and subcategories', () => {
    expect(
      mapCategories({
        results: [
          {
            _links: {
              self: {
                href:
                  'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
              },
            },
            name: 'Overlast van dieren',
            slug: 'overlast-van-dieren',
            sub_categories: [
              {
                _links: {
                  self: {
                    href:
                      'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
                  },
                },
                name: 'Dode dieren',
                slug: 'dode-dieren',
                handling_message: 'handling dode dieren',
                is_active: true,
              },
              {
                _links: {
                  self: {
                    href:
                      'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
                  },
                },
                name: 'Duiven',
                slug: 'duiven',
                handling_message: 'handling duiven',
              },
            ],
          },
          {
            _links: {
              self: {
                href:
                  'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair',
              },
            },
            name: 'Wegen, verkeer, straatmeubilair',
            slug: 'wegen-verkeer-straatmeubilair',
            sub_categories: [
              {
                _links: {
                  self: {
                    href:
                      'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid',
                  },
                },
                name: 'Gladheid',
                slug: 'gladheid',
                handling_message: 'handling gladheid',
                is_active: true,
              },
            ],
          },
        ],
      })
    ).toEqual({
      main: [
        {
          key:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
          value: 'Overlast van dieren',
          slug: 'overlast-van-dieren',
        },
        {
          key:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair',
          value: 'Wegen, verkeer, straatmeubilair',
          slug: 'wegen-verkeer-straatmeubilair',
        },
      ],
      sub: [
        {
          key:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
          value: 'Dode dieren',
          slug: 'dode-dieren',
          category_slug: 'overlast-van-dieren',
          handling_message: 'handling dode dieren',
        },
        {
          key:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid',
          value: 'Gladheid',
          slug: 'gladheid',
          category_slug: 'wegen-verkeer-straatmeubilair',
          handling_message: 'handling gladheid',
        },
      ],
      mainToSub: {
        'overlast-van-dieren': [
          {
            id:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/dode-dieren',
            value: 'Dode dieren',
            slug: 'dode-dieren',
            category_slug: 'overlast-van-dieren',
            handling_message: 'handling dode dieren',
          },
        ],
        'wegen-verkeer-straatmeubilair': [
          {
            id:
              'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/gladheid',
            value: 'Gladheid',
            slug: 'gladheid',
            handling_message: 'handling gladheid',
            category_slug: 'wegen-verkeer-straatmeubilair',
          },
        ],
      },
    });
  });
});
