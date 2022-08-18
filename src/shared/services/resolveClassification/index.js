// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

export const MINIMUM_CERTAINTY = 0.41
export const DEFAULT_CLASSIFICATION = 'overig'

// main and subcategory slug matcher regex
export const reCategory = /terms\/categories\/([^/]+)(?:\/?[^/]+\/([^/]+))?$/

/**
 * Resolve classification
 *
 * @param {Object} classification - Prediction service POST response
 * @param {Array[]} classification.hoofdrubriek - Hoofdrubriek prediction
 * @param {String[]} classification.hoofdrubriek[0] - Hoofdrubriek main category ID
 * @param {number[]} classification.hoofdrubriek[1] - Hoofdrubriek main category prediction certainty
 * @param {Array[]} classification.subrubriek - Subrubriek prediction
 * @param {String[]} classification.subrubriek[0] - Subrubriek subcategory ID
 * @param {number[]} classification.subrubriek[1] - Subrubriek subcategory prediction certainty
 *
 * @returns {Object} With keys `category`, `subcategory`
 */
const resolveClassification = ({
  hoofdrubriek = [[], []],
  subrubriek = [[], []],
} = {}) => {
  const subrubriekMeetsMinimumCertainty = MINIMUM_CERTAINTY <= subrubriek[1][0]
  const hoofdrubriekMeetsMinimumCertainty =
    MINIMUM_CERTAINTY <= hoofdrubriek[1][0]

  if (subrubriekMeetsMinimumCertainty) {
    const [, category, subcategory] = subrubriek[0][0].match(reCategory)

    return {
      category,
      subcategory,
    }
  }

  if (hoofdrubriekMeetsMinimumCertainty) {
    const [, category] = hoofdrubriek[0][0].match(reCategory)

    if (configuration.featureFlags.enableAmsterdamSpecificOverigCategories) {
      return amsterdamSpecificOverigCategory(category)
    }

    const genericOverigSubcategory = `${DEFAULT_CLASSIFICATION}-${category}`

    return {
      category,
      subcategory: genericOverigSubcategory,
    }
  }

  return {
    category: DEFAULT_CLASSIFICATION,
    subcategory: DEFAULT_CLASSIFICATION,
  }
}

/**
 * Get Amsterdam-specific "overig" categories
 *
 * @param {String} category - The main category
 *
 * @returns {Object} With keys `category`, `subcategory`
 */
const amsterdamSpecificOverigCategory = (category) => {
  let subcategory

  switch (category) {
    case 'afval':
      subcategory = 'overig-afval'
      break

    case 'schoon':
      subcategory = 'veegzwerfvuil'
      break

    case 'openbaar-groen-en-water':
      subcategory = 'overig-groen-en-water'
      break

    case 'overlast-bedrijven-en-horeca':
      subcategory = 'overig-horecabedrijven'
      break

    case 'overlast-in-de-openbare-ruimte':
      subcategory = 'overig-openbare-ruimte'
      break

    case 'overlast-op-het-water':
      subcategory = 'overig-boten'
      break

    case 'overlast-van-dieren':
      subcategory = 'overig-dieren'
      break

    case 'overlast-van-en-door-personen-of-groepen':
      subcategory = 'overige-overlast-door-personen'
      break

    case 'wegen-verkeer-straatmeubilair':
      subcategory = 'overig-wegen-verkeer-straatmeubilair'
      break

    case 'wonen':
      subcategory = 'wonen-overig'
      break

    default:
      subcategory = DEFAULT_CLASSIFICATION
  }

  return {
    category,
    subcategory,
  }
}

export default resolveClassification
