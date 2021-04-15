// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import {
  FILLER,
  getNextIndex,
  getPreviousIndex,
  getRange,
  NEXT,
  pageNumbersList,
  PREVIOUS,
} from '../utils'

describe('src/components/Pagination/utils', () => {
  const totalPages = 10

  describe('getPreviousIndex', () => {
    expect(getPreviousIndex(1)).toEqual(1)
    expect(getPreviousIndex(2)).toEqual(1)
    expect(getPreviousIndex(3)).toEqual(2)
  })

  describe('getNextIndex', () => {
    expect(getNextIndex(1, totalPages)).toEqual(2)
    expect(getNextIndex(9, totalPages)).toEqual(totalPages)
    expect(getNextIndex(totalPages, totalPages)).toEqual(totalPages)
  })

  describe('getRange', () => {
    expect(getRange(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  describe('pageNumbersList', () => {
    it('should return ...', () => {
      expect(pageNumbersList(1, 4)).toHaveLength(4)
    })

    it('should always contain first and last page numbers', () => {
      ;[...new Array(totalPages).keys()].forEach((index) => {
        const currentPage = index + 1
        const list = pageNumbersList(currentPage, totalPages)

        expect(list).toContain(1)
        expect(list).toContain(totalPages)
      })
    })

    it('should contain previous and next entries', () => {
      expect(pageNumbersList(1, totalPages)).toContain(NEXT)
      expect(pageNumbersList(1, totalPages)).not.toContain(PREVIOUS)

      ;[...new Array(totalPages).keys()]
        .filter((index) => index > 0 && index < totalPages - 1)
        .forEach((index) => {
          const currentPage = index + 1
          const list = pageNumbersList(currentPage, totalPages)

          expect(list).toContain(NEXT)
          expect(list).toContain(PREVIOUS)
        })

      expect(pageNumbersList(totalPages, totalPages)).not.toContain(NEXT)
      expect(pageNumbersList(totalPages, totalPages)).toContain(PREVIOUS)
    })

    it('should contain adjacent page numbers', () => {
      // 1, 2, ..., 10, next (current: 1)
      expect(pageNumbersList(1, totalPages)).toContain(2)
      expect(pageNumbersList(1, totalPages)).toContain(FILLER)
      expect(pageNumbersList(1, totalPages)).not.toContain(3)
      expect(pageNumbersList(1, totalPages)).toHaveLength(5)

      // previous, 1, 2, 3, ..., 10, next (current: 2)
      expect(pageNumbersList(2, totalPages)).toContain(3)
      expect(pageNumbersList(2, totalPages)).toContain(FILLER)
      expect(pageNumbersList(2, totalPages)).toHaveLength(7)

      // previous, 1, 2, 3, 4, ..., 10, next (current: 3)
      expect(pageNumbersList(3, totalPages)).toContain(2)
      expect(pageNumbersList(3, totalPages)).toContain(4)
      expect(pageNumbersList(3, totalPages)).toContain(FILLER)
      expect(pageNumbersList(3, totalPages)).toHaveLength(8)

      // previous, 1, ..., 3, 4, 5, ..., 10, next (current: 4)
      expect(pageNumbersList(4, totalPages)).toContain(3)
      expect(pageNumbersList(4, totalPages)).toContain(5)
      expect(
        pageNumbersList(4, totalPages).filter((item) => item === FILLER)
      ).toHaveLength(2)
      expect(pageNumbersList(4, totalPages)).toHaveLength(9)

      // previous, 1, ..., 7, 8, 9, 10, next (current: 8)
      expect(pageNumbersList(8, totalPages)).toContain(7)
      expect(pageNumbersList(8, totalPages)).toContain(9)
      expect(pageNumbersList(8, totalPages)).toContain(FILLER)
      expect(pageNumbersList(8, totalPages)).toHaveLength(8)

      // previous, 1, ..., 8, 9, 10, next (current: 9)
      expect(pageNumbersList(9, totalPages)).toContain(8)
      expect(pageNumbersList(9, totalPages)).toContain(FILLER)
      expect(pageNumbersList(9, totalPages)).toHaveLength(7)

      // previous, 1, ..., 9, 10 (current: 10)
      expect(pageNumbersList(10, totalPages)).toContain(9)
      expect(pageNumbersList(10, totalPages)).toContain(FILLER)
      expect(pageNumbersList(10, totalPages)).toHaveLength(5)
    })
  })
})
