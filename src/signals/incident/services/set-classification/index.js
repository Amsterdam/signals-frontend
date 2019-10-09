import CONFIGURATION from 'shared/services/configuration/configuration';

export const MINIMUM_CERTAINTY = 0.41;
const DEFAULT_CATEGORY = 'overig';

const categoryServerUri = `${CONFIGURATION.API_ROOT}signals/v1/public/terms/categories/`;
const DEFAULT_CATEGORY_LINK = `${categoryServerUri}${DEFAULT_CATEGORY}/sub_categories/${DEFAULT_CATEGORY}`;

const setClassification = (result, subcategories) => {
  const hoofdrubriek = result && result.hoofdrubriek;
  const subrubriek = result && result.subrubriek;
  let category = DEFAULT_CATEGORY;
  let subcategory = DEFAULT_CATEGORY;
  let subcategory_link = DEFAULT_CATEGORY_LINK;

  if (!hoofdrubriek || !subrubriek) {
    const found = subcategories && subcategories.find((sub) => sub.key.includes(`${DEFAULT_CATEGORY}/sub_categories/${DEFAULT_CATEGORY}`));

    return {
      category: DEFAULT_CATEGORY,
      subcategory: DEFAULT_CATEGORY,
      subcategory_link: DEFAULT_CATEGORY_LINK,
      handling_message: (found && found.handling_message) || 'Niet gevonden.'
    };
  }

  const useSubClassification = subrubriek && MINIMUM_CERTAINTY <= subrubriek[1][0];
  const useMainClassification = hoofdrubriek && MINIMUM_CERTAINTY <= hoofdrubriek[1][0];

  if (useSubClassification) {
    subcategory_link = subrubriek[0][0];
    category = subcategory_link.match(/\/categories\/(.*?)\/sub_categories\//)[1];
    subcategory = subcategory_link.match(/\/sub_categories\/(.*?)$/)[1];
  } else if (useMainClassification) {
    // eslint-disable-next-line default-case
    switch (hoofdrubriek[0][0]) {
      case `${categoryServerUri}afval`:
        category = 'afval';
        subcategory = 'overig-afval';
        break;

      case `${categoryServerUri}openbaar-groen-en-water`:
        category = 'openbaar-groen-en-water';
        subcategory = 'overig-groen-en-water';
        break;

      case `${categoryServerUri}overlast-bedrijven-en-horeca`:
        category = 'overlast-bedrijven-en-horeca';
        subcategory = 'overig-horecabedrijven';
        break;

      case `${categoryServerUri}overlast-in-de-openbare-ruimte`:
        category = 'overlast-in-de-openbare-ruimte';
        subcategory = 'overig-openbare-ruimte';
        break;

      case `${categoryServerUri}overlast-op-het-water`:
        category = 'overlast-op-het-water';
        subcategory = 'overig-boten';
        break;

      case `${categoryServerUri}overlast-van-dieren`:
        category = 'overlast-van-dieren';
        subcategory = 'overig-dieren';
        break;

      case `${categoryServerUri}overlast-van-en-door-personen-of-groepen`:
        category = 'overlast-van-en-door-personen-of-groepen';
        subcategory = 'overige-overlast-door-personen';
        break;

      case `${categoryServerUri}wegen-verkeer-straatmeubilair`:
        category = 'wegen-verkeer-straatmeubilair';
        subcategory = 'overig-wegen-verkeer-straatmeubilair';
        break;
    }

    subcategory_link = `${categoryServerUri}${category}/sub_categories/${subcategory}`;
  }

  const found = subcategories && subcategories.find((sub) => sub.key.includes(`${category}/sub_categories/${subcategory}`));

  return {
    category,
    subcategory,
    subcategory_link,
    handling_message: (found && found.handling_message) || 'Niet gevonden.'
  };
};

export default setClassification;
