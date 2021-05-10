// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { SearchBar, styles } from '@amsterdam/asc-ui'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'

import { setSearchQuery, resetSearchQuery } from 'containers/App/actions'
import { makeSelectSearchQuery } from 'containers/App/selectors'
import styled from 'styled-components'

const StyledSearchBar = styled(SearchBar)`
  ${styles.TextFieldStyle} > input {
    padding: 10px; /* needed to style the textboxes as according to the design system */
  }
`

export const SearchBarComponent = ({
  className,
  query,
  resetSearchQueryAction,
  setSearchQueryAction,
}) => {
  /**
   * Send search form input to actions
   *
   * @param {SyntheticEvent} event
   */
  const onSearchSubmit = useCallback(
    (event) => {
      event.preventDefault()
      event.persist()
      const { value } = event.target.querySelector('input')

      setSearchQueryAction(value)
    },
    [setSearchQueryAction]
  )

  const onChange = useCallback(
    (event) => {
      event.persist()
      const { value } = event.target

      if (value === '') {
        resetSearchQueryAction()
      }
    },
    [resetSearchQueryAction]
  )

  return (
    <form onSubmit={onSearchSubmit}>
      <StyledSearchBar
        className={className}
        data-testid="searchBar"
        placeholder="Zoek op meldingsnummer"
        onChange={onChange}
        onClear={() => resetSearchQueryAction()}
        value={query}
      />
    </form>
  )
}

SearchBarComponent.defaultProps = {
  className: '',
}

SearchBarComponent.propTypes = {
  className: PropTypes.string,
  setSearchQueryAction: PropTypes.func.isRequired,
  resetSearchQueryAction: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
}

const mapStateToProps = createStructuredSelector({
  query: makeSelectSearchQuery,
})

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      resetSearchQueryAction: resetSearchQuery,
      setSearchQueryAction: setSearchQuery,
    },
    dispatch
  )

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(SearchBarComponent)
