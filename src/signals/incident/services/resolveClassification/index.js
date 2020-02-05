export const MINIMUM_CERTAINTY = 0.41;

// main and subcategory slug matcher regex
const reCategory = /terms\/categories\/([^/]+)(?:\/?(?:[^/]+)\/([^/]+))?$/;

export default ({ hoofdrubriek, subrubriek }) => {
  const subrubriekMeetsMinimumCertainty = MINIMUM_CERTAINTY <= subrubriek[1][0];
  const hoofdrubriekMeetsMinimumCertainty = MINIMUM_CERTAINTY <= hoofdrubriek[1][0];

  if (subrubriekMeetsMinimumCertainty) {
    const [, category, subcategory] = subrubriek[0][0].match(reCategory);

    return {
      category,
      subcategory,
    };
  }

  if (hoofdrubriekMeetsMinimumCertainty) {
    const [, category] = hoofdrubriek[0][0].match(reCategory);
    let subcategory;

    switch (category) {
      case 'afval':
        subcategory = 'overig-afval';
        break;

      case 'openbaar-groen-en-water':
        subcategory = 'overig-groen-en-water';
        break;

      case 'overlast-bedrijven-en-horeca':
        subcategory = 'overig-horecabedrijven';
        break;

      case 'overlast-in-de-openbare-ruimte':
        subcategory = 'overig-openbare-ruimte';
        break;

      case 'overlast-op-het-water':
        subcategory = 'overig-boten';
        break;

      case 'overlast-van-dieren':
        subcategory = 'overig-dieren';
        break;

      case 'overlast-van-en-door-personen-of-groepen':
        subcategory = 'overige-overlast-door-personen';
        break;

      case 'wegen-verkeer-straatmeubilair':
        subcategory = 'overig-wegen-verkeer-straatmeubilair';
        break;

      default:
        subcategory = 'overig';
    }

    return {
      category,
      subcategory,
    };
  }

  return {
    category: 'overig',
    subcategory: 'overig',
  };
};
