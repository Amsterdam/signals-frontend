import setClassification from './index';

describe.only('The set classification service', () => {
  it('should return Overig by default', () => {
    expect(setClassification()).toEqual({
      category: 'overig',
      subcategory: 'overig',
      subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig'
    });
  });

  it('should return correct classification when minimum subcategory chance is met', () => {
    expect(
      setClassification({
        subrubriek: [
          [
            'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
            'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/wildplassen-poepen-overgeven',
            'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven'
          ],
          [0.40, 0.1424216693948545, 0.04586915076913858]
        ]
      })
    ).toEqual({
      category: 'overlast-in-de-openbare-ruimte',
      subcategory: 'hondenpoep',
      subcategory_link: 'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep'
    });
  });

  it('should return Oberig when minimum subcategory chance is met', () => {
    expect(
      setClassification({
        subrubriek: [
          [
            'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/hondenpoep',
            'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/wildplassen-poepen-overgeven',
            'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/duiven'
          ],
          [0.39, 0.1424216693948545, 0.04586915076913858]
        ]
      })
    ).toEqual({
      category: 'overig',
      subcategory: 'overig',
      subcategory_link: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig'
    });
  });
});
