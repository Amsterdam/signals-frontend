const MINIMUM_SUBCATEGORY_CHANCE = 0.40;
const DEFAULT_CATEGORY = 'overig';
const DEFAULT_CATEGORY_LINK = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overig/sub_categories/overig';

function setClassification(result) {
  const useClassification = result && result.subrubriek && MINIMUM_SUBCATEGORY_CHANCE <= result.subrubriek[1][0];

  if (useClassification) {
    const subcategoryLink = result.subrubriek[0][0];
    const subcategory = subcategoryLink.match(/\/sub_categories\/(.*?)$/)[1];
    const category = subcategoryLink.match(/\/categories\/(.*?)\/sub_categories\//)[1];

    return {
      category,
      subcategory,
      subcategory_link: subcategoryLink
    };
  }

  return {
    category: DEFAULT_CATEGORY,
    subcategory: DEFAULT_CATEGORY,
    subcategory_link: DEFAULT_CATEGORY_LINK
  };
}

export default setClassification;
