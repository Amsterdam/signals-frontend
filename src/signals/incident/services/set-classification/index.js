const MINIMUM_CERTAINTY = 0.40;
const DEFAULT_CATEGORY = 'overig';
const categoryServerUri = 'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/';
const DEFAULT_CATEGORY_LINK = `${categoryServerUri}${DEFAULT_CATEGORY}/sub_categories/${DEFAULT_CATEGORY}`;
const defaultCategory = {
  category: DEFAULT_CATEGORY,
  subcategory: DEFAULT_CATEGORY,
  subcategory_link: DEFAULT_CATEGORY_LINK
};

function setClassification(result) {
  if (!result) {
    return defaultCategory;
  }

  const useSubClassification = result && result.subrubriek && MINIMUM_CERTAINTY <= result.subrubriek[1][0];
  const useMainClassification = result && result.hoofdrubriek && MINIMUM_CERTAINTY <= result.hoofdrubriek[1][0];

  if (useSubClassification) {
    const subcategoryLink = result.subrubriek[0][0];
    const subcategory = subcategoryLink.match(/\/sub_categories\/(.*?)$/)[1];
    const category = subcategoryLink.match(/\/categories\/(.*?)\/sub_categories\//)[1];

    return {
      category,
      subcategory,
      subcategory_link: subcategoryLink
    };
  } else if (useMainClassification) {
    switch (result.hoofdrubriek[0][0]) {
      case `${categoryServerUri}afval`:
        return {
          category: 'afval',
          subcategory: 'overig-afval',
          subcategory_link: `${categoryServerUri}afval/sub_categories/overig-afval`
        };

      case `${categoryServerUri}openbaar-groen-en-water`:
        return {
          category: 'openbaar-groen-en-water',
          subcategory: 'overig-groen-en-water',
          subcategory_link: `${categoryServerUri}openbaar-groen-en-water/sub_categories/overig-groen-en-water`
        };

      case `${categoryServerUri}overlast-bedrijven-en-horeca`:
        return {
          category: 'overlast-bedrijven-en-horeca',
          subcategory: 'overig-horecabedrijven',
          subcategory_link: `${categoryServerUri}overlast-bedrijven-en-horeca/sub_categories/overig-horecabedrijven`
        };

      case `${categoryServerUri}overlast-in-de-openbare-ruimte`:
        return {
          category: 'overlast-in-de-openbare-ruimte',
          subcategory: 'overig-openbare-ruimte',
          subcategory_link: `${categoryServerUri}overlast-in-de-openbare-ruimte/sub_categories/overig-openbare-ruimte`
        };

      case `${categoryServerUri}overlast-op-het-water`:
        return {
          category: 'overlast-op-het-water',
          subcategory: 'overig-boten',
          subcategory_link: `${categoryServerUri}overlast-op-het-water/sub_categories/overig-boten`
        };

      case `${categoryServerUri}overlast-van-dieren`:
        return {
          category: 'overlast-van-dieren',
          subcategory: 'overig-dieren',
          subcategory_link: `${categoryServerUri}overlast-van-dieren/sub_categories/overig-dieren`
        };

      case `${categoryServerUri}overlast-van-en-door-personen-of-groepen`:
        return {
          category: 'overlast-van-en-door-personen-of-groepen',
          subcategory: 'overige-overlast-door-personen',
          subcategory_link: `${categoryServerUri}overlast-van-en-door-personen-of-groepen/sub_categories/overige-overlast-door-personen`
        };

      case `${categoryServerUri}wegen-verkeer-straatmeubilair`:
        return {
          category: 'wegen-verkeer-straatmeubilair',
          subcategory: 'overig-wegen-verkeer-straatmeubilair',
          subcategory_link: `${categoryServerUri}wegen-verkeer-straatmeubilair/sub_categories/overig-wegen-verkeer-straatmeubilair`
        };

      default:
        return defaultCategory;
    }
  }

  return defaultCategory;
}

export default setClassification;
