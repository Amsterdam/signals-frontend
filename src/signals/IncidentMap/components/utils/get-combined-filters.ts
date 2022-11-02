// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Filter } from '../../types'

/**
 *  This method combines all categories involved (main and sub)
 *  when toggling filters' filterActive property.
 *
 *  It returns a flatten set of filters, that are reduced in updateFilterCategory.
 * When changing a main category, sub categories filterActive property will be changed too.
 * When changing a sub category, update its parents filterActive property (to false ) if all
 * subs are false. If none of above, just change sub.
 */
export function getCombinedFilters(filter: Filter, allFilters: Filter[]) {
  let combinedFilters = [filter]
  const subParent = allFilters.find((parentFilter) =>
    parentFilter.subCategories?.some(
      (subFilter) => subFilter.slug === filter.slug
    )
  )

  // main category
  if (filter.subCategories) {
    combinedFilters = [...combinedFilters, ...filter.subCategories]
    // subcategory
  } else if (
    subParent &&
    subParent?.subCategories
      ?.filter((subCat) => subCat.slug !== filter.slug)
      ?.every((subCat) => !subCat.filterActive)
  ) {
    combinedFilters = [...combinedFilters, subParent]
  }
  return combinedFilters
}
