const MINIMUM_SUBCATEGORY_CHANCE = 0.40;
const DEFAULT_CATEGORY = 'overig';
const categoryServer = 'https://api.data.amsterdam.nl/';
const DEFAULT_CATEGORY_LINK = `${categoryServer}signals/v1/public/terms/categories/overig/sub_categories/overig`;
const defaultCategory = {
  category: DEFAULT_CATEGORY,
  subcategory: DEFAULT_CATEGORY,
  subcategory_link: DEFAULT_CATEGORY_LINK
};

function setClassification(result) {
  if (!result) {
    return defaultCategory;
  }

  const useSubClassification = result && result.subrubriek && MINIMUM_SUBCATEGORY_CHANCE <= result.subrubriek[1][0];
  const useMainClassification = result && result.hoofdrubriek && MINIMUM_SUBCATEGORY_CHANCE <= result.hoofdrubriek[1][0];

  if (useSubClassification) {
    const subcategoryLink = result.subrubriek[0][0];
    const subcategory = subcategoryLink.match(/\/sub_categories\/(.*?)$/)[1];
    const category = subcategoryLink.match(/\/categories\/(.*?)\/sub_categories\//)[1];

    console.log('sub', subcategory);
    return {
      category,
      subcategory,
      subcategory_link: subcategoryLink
    };
  } else if (useMainClassification) {
    switch (result.hoofdrubriek[0][0]) {
      case `${categoryServer}signals/v1/public/terms/categories/afval`:
        return {
          category: 'afval',
          subcategory: 'overig-afval',
          subcategory_link: `${categoryServer}signals/v1/public/terms/categories/afval/sub_categories/overig-afval`
        };

      case `${categoryServer}signals/v1/public/terms/categories/openbaar-groen-en-water`:
        return {
          category: 'openbaar-groen-en-water',
          subcategory: 'overig-groen-en-water',
          subcategory_link: `${categoryServer}signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/overig-groen-en-water`
        };

      case `${categoryServer}signals/v1/public/terms/categories/overlast-bedrijven-en-horeca`:
        return {
          category: 'overlast-bedrijven-en-horeca',
          subcategory: 'overig-horecabedrijven',
          subcategory_link: `${categoryServer}signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overig-horecabedrijven`
        };

      case `${categoryServer}signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte`:
        return {
          category: 'overlast-in-de-openbare-ruimte',
          subcategory: 'overig-openbare-ruimte',
          subcategory_link: `${categoryServer}signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/overig-openbare-ruimte`
        };

      case `${categoryServer}signals/v1/public/terms/categories/overlast-op-het-water`:
        return {
          category: 'overlast-op-het-water',
          subcategory: 'overig-boten',
          subcategory_link: `${categoryServer}signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/overig-boten`
        };

      case `${categoryServer}signals/v1/public/terms/categories/overlast-van-dieren`:
        return {
          category: 'overlast-van-dieren',
          subcategory: 'overig-dieren',
          subcategory_link: `${categoryServer}signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/overig-dieren`
        };

      case `${categoryServer}signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen`:
        return {
          category: 'overlast-van-en-door-personen-of-groepen',
          subcategory: 'overige-overlast-door-personen',
          subcategory_link: `${categoryServer}signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen`
        };

      case `${categoryServer}signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair`:
        return {
          category: 'wegen-verkeer-straatmeubilair',
          subcategory: 'overig-wegen-verkeer-straatmeubilair',
          subcategory_link: `${categoryServer}signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/overig-wegen-verkeer-straatmeubilair`
        };

      default:
        return defaultCategory;
    }
  }

  return defaultCategory;
}

export default setClassification;
