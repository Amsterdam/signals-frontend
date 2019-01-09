import filterSubcategories from './index';

describe('The filterSubcategories service', () => {
  const categories = {
    main: [
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
        value: 'Afval',
        slug: 'afval'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren',
        value: 'Overlast van dieren',
        slug: 'overlast-van-dieren'
      }
    ],
    sub: [
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-kapot',
        value: 'Container is kapot',
        slug: 'container-is-kapot'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/grofvuil',
        value: 'Grofvuil',
        slug: 'grofvuil'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
        value: 'Ganzen',
        slug: 'ganzen'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
        value: 'Container is vol',
        slug: 'container-is-vol'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
        value: 'Duiven',
        slug: 'duiven'
      }
    ],
    mainToSub: {
      '': [
        'container-is-kapot',
        'container-is-vol',
        'grofvuil',
        'duiven',
        'ganzen'
      ],
      'overlast-van-dieren': [
        'duiven',
        'ganzen'
      ],
      afval: [
        'container-is-kapot',
        'container-is-vol',
        'grofvuil'
      ]
    }
  };

  it('should by default return empty subcategories', () => {
    expect(filterSubcategories()).toEqual([]);
  });

  it('should ignore empty "" and return other subcategories', () => {
    expect(filterSubcategories(['', 'overlast-van-dieren'], categories)).toEqual([
      {
        key: '',
        value: 'Alles',
        slug: ''
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
        value: 'Duiven',
        slug: 'duiven'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
        value: 'Ganzen',
        slug: 'ganzen'
      },
    ]);
  });

  it('should return all subcategories when no main slug is present', () => {
    expect(filterSubcategories(undefined, categories)).toEqual([
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-kapot',
        value: 'Container is kapot',
        slug: 'container-is-kapot'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
        value: 'Container is vol',
        slug: 'container-is-vol'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
        value: 'Duiven',
        slug: 'duiven'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
        value: 'Ganzen',
        slug: 'ganzen'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/grofvuil',
        value: 'Grofvuil',
        slug: 'grofvuil'
      }
    ]);
  });

  it('should return only afval subcategories', () => {
    expect(filterSubcategories(['afval'], categories)).toEqual([
      {
        key: '',
        value: 'Alles',
        slug: ''
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-kapot',
        value: 'Container is kapot',
        slug: 'container-is-kapot'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
        value: 'Container is vol',
        slug: 'container-is-vol'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/grofvuil',
        value: 'Grofvuil',
        slug: 'grofvuil'
      }
    ]);
  });

  it('should return both afval and dieren subcategories', () => {
    expect(filterSubcategories(['afval', 'overlast-van-dieren'], categories)).toEqual([
      {
        key: '',
        value: 'Alles',
        slug: ''
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-kapot',
        value: 'Container is kapot',
        slug: 'container-is-kapot'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
        value: 'Container is vol',
        slug: 'container-is-vol'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven',
        value: 'Duiven',
        slug: 'duiven'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen',
        value: 'Ganzen',
        slug: 'ganzen'
      },
      {
        key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/grofvuil',
        value: 'Grofvuil',
        slug: 'grofvuil'
      }
    ]);
  });
});
