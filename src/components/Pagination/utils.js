// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
export const FILLER = 'FILLER';
export const NEXT = 'NEXT';
export const PREVIOUS = 'PREVIOUS';

/**
 * Gets the previous valid index
 *
 * @param   {number} currentPage - current page index
 * @returns {number} previous page index
 */
export const getPreviousIndex = currentPage =>
  currentPage === 1 ? currentPage : currentPage - 1;

/**
 * Gets the next valid index
 *
 * @param   {number} currentPage - current page index
 * @param   {number} totalPages - total number of pages
 * @returns {number} next page index
 */
export const getNextIndex = (currentPage, totalPages) =>
  currentPage === totalPages ? currentPage : currentPage + 1;

/**
 * Get an array of 1-based numbers
 *
 * @param {number} from - First number in the array
 * @param {number} to - Last number in the array
 * @returns {number[]}
 */
export const getRange = (from, to) =>
  [...new Array(to).keys()].map(key => key + 1).filter(key => key >= from);

/**
 * Get an array of page numbers, filler indicators and navigation indicators
 *
 * @param   {number} currentPage - current page index
 * @param   {number} totalPages - total number of pages
 * @returns {(string|number)[]}
 */
export const pageNumbersList = (currentPage, totalPages) => {
  /**
   * totalNumbers: the total page numbers to show on the control; pages on either side of
   * the current page + the optional spill or navigation buttons
   */
  const totalNumbers = 5;

  if (totalPages <= totalNumbers) {
    return getRange(1, totalPages);
  }

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  const pages = getRange(startPage, endPage);

  /**
   * hasLeftSpill: has hidden pages to the left
   * hasRightSpill: has hidden pages to the right
   */
  const hasLeftSpill = startPage > 2;
  const hasRightSpill = totalPages - endPage > 1;

  const items = [
    currentPage > 1 && PREVIOUS,
    1,
    hasLeftSpill && FILLER,
    ...pages,
    hasRightSpill && FILLER,
    totalPages,
    currentPage < totalPages && NEXT,
  ];

  return items.filter(Boolean);
};
