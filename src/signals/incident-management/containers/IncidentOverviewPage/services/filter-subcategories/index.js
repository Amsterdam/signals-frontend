import { isEqual, sortBy } from 'lodash';
const filterSubcategories = (mainCategoryFilterSelection, categories) => {
  let filteredSubcategoryList = [];

  if (categories && categories.sub) {
    if (!mainCategoryFilterSelection || mainCategoryFilterSelection === undefined || isEqual(mainCategoryFilterSelection, [['']])) {
      return sortBy(categories.sub, 'value');
    }
    if (mainCategoryFilterSelection.length > 1 && mainCategoryFilterSelection.indexOf('') > -1) {
      // Do not select 'Alles' and other categories to prevent duplicates
      mainCategoryFilterSelection.splice(mainCategoryFilterSelection.indexOf(''), 1);
    }

    filteredSubcategoryList = mainCategoryFilterSelection
      .flatMap((mainCategory) =>
        categories.mainToSub[mainCategory].flatMap((sub) => categories.sub.find((item) => item.slug === sub)));
    filteredSubcategoryList = [{ key: '', value: 'Alles', slug: '' }].concat(sortBy(filteredSubcategoryList, 'value'));
  }

  return filteredSubcategoryList;
};

export default filterSubcategories;
