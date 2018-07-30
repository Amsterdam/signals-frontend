const MINIMUM_SUBCATEGORY_CHANCE = 0.40;
const DEFAULT_CATEGORY = 'Overig';

function setClassification(result) {
  const useClassification = result && result.subrubriek && MINIMUM_SUBCATEGORY_CHANCE < result.subrubriek[1][0];
  return {
    category: useClassification ? result.hoofdrubriek[0][0] : DEFAULT_CATEGORY,
    subcategory: useClassification ? result.subrubriek[0][0] : DEFAULT_CATEGORY
  };
}

export default setClassification;
