// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeColor, themeSpacing, Typography } from '@amsterdam/asc-ui'
import PaginationItem from './components/PaginationItem'
import {
  getPreviousIndex,
  getNextIndex,
  pageNumbersList,
  FILLER,
  NEXT,
  PREVIOUS,
} from './utils'

const List = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
  }

  li + li {
    margin-left: ${themeSpacing(3)};
  }
`

const CurrentPage = styled(Typography)`
  align-items: center;
  background-color: ${themeColor('tint', 'level5')};
  color: white;
  display: flex;
  margin: 0;
  padding: 0 ${themeSpacing(2)};
  font-family: avenir next w01, arial, sans-serif;
  font-size: inherit;
`

const Filler = styled(Typography)`
  margin: 0;
  padding: 0 ${themeSpacing(2)};
  font-family: avenir next w01, arial, sans-serif;
`

/**
 * Stateless component that renders pagination items
 */
const Pagination = ({
  className,
  currentPage,
  hrefPrefix,
  onClick,
  shouldPushToHistory,
  totalPages,
}) => {
  const pagesInRange = useMemo(
    () => pageNumbersList(currentPage, totalPages),
    [currentPage, totalPages]
  )

  const items = useMemo(
    () =>
      pagesInRange.map((pageNum, index) => {
        const prevIndex = getPreviousIndex(currentPage)
        const nextIndex = getNextIndex(currentPage, totalPages)

        switch (pageNum) {
          case PREVIOUS:
            return (
              <PaginationItem
                isNav
                key={pageNum}
                label="Vorige"
                onClick={() => onClick && onClick(prevIndex)}
                pageNum={pageNum}
                shouldPushToHistory={shouldPushToHistory}
                to={`${hrefPrefix}${prevIndex}`}
              />
            )

          case NEXT:
            return (
              <PaginationItem
                data-testid="pagination-next"
                isNav
                key={pageNum}
                label="Volgende"
                onClick={() => onClick && onClick(nextIndex)}
                pageNum={pageNum}
                shouldPushToHistory={shouldPushToHistory}
                to={`${hrefPrefix}${nextIndex}`}
              />
            )

          case FILLER:
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Filler
                data-testid="pagination-filler"
                key={`${pageNum}${index}`}
              >
                ...
              </Filler>
            )

          case currentPage:
            return <CurrentPage key={pageNum}>{pageNum}</CurrentPage>

          default:
            return (
              <PaginationItem
                key={pageNum}
                onClick={() => onClick && onClick(pageNum)}
                pageNum={pageNum}
                shouldPushToHistory={shouldPushToHistory}
                to={`${hrefPrefix}${pageNum}`}
                label={pageNum}
              />
            )
        }
      }),
    [
      currentPage,
      hrefPrefix,
      onClick,
      pagesInRange,
      shouldPushToHistory,
      totalPages,
    ]
  )

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className={className} data-testid="pagination">
      <List>
        {items.map((item) => (
          <li key={item.key}>{item}</li>
        ))}
      </List>
    </nav>
  )
}

Pagination.defaultProps = {
  className: '',
  hrefPrefix: '',
  onClick: null,
  shouldPushToHistory: false,
}

Pagination.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** the current active page */
  currentPage: PropTypes.number.isRequired,
  /** href prefix (will render `<a>` as items) */
  hrefPrefix: PropTypes.string,
  /**
   * Gets called on pagination item click
   *
   * @param {number} index - Page index of the item that has been clicked
   */
  onClick: PropTypes.func,
  /** When true, clicking a pagination item will change the url to `${hrefPrefix}${currentPage}` */
  shouldPushToHistory: PropTypes.bool,
  /** total number of pages */
  totalPages: PropTypes.number.isRequired,
}

export default Pagination
