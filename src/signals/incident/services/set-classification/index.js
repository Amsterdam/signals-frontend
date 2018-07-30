const MINIMUM_SUBCATEGORY_CHANCE = 0.40;
const DEFAULT_CATEGORY = 'Overig';

function setClassification(clasificationResult) {
  const useClassification = clasificationResult.subrubriek && MINIMUM_SUBCATEGORY_CHANCE < clasificationResult.subrubriek[1][0];
  return {
    category: useClassification ? clasificationResult.hoofdrubriek[0][0] : DEFAULT_CATEGORY,
    subcategory: useClassification ? clasificationResult.subrubriek[0][0] : DEFAULT_CATEGORY
  };
}

export default setClassification;
