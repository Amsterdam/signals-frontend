import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback, useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, useLocation, Link } from 'react-router-dom';
import { Row, Column, themeSpacing, Button, SearchBar } from '@datapunt/asc-ui';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import debounce from 'lodash/debounce';

import { makeSelectUserCan } from 'containers/App/selectors';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Pagination from 'components/Pagination';
import PageHeader from 'signals/settings/components/PageHeader';
import DataView from 'signals/settings/components/DataView';
import { USERS_PAGED_URL, USER_URL } from 'signals/settings/routes';
import useFetchUsers from './hooks/useFetchUsers';

const StyledPagination = styled(Pagination)`
  margin-top: ${themeSpacing(12)};
`;

const HeaderButton = styled(Button)`
  &:hover {
    color: white;
  }
`;

const StyledSearchbar = styled(SearchBar)`
  > button {
    display: none;
  }
`;

const filtersReducer = (state, action) => {
  switch (action.type) {
    case 'username':
      return { username: action.payload };
    default:
      throw new Error();
  }
};

export const UsersOverviewContainer = ({ pageSize, userCan }) => {
  const history = useHistory();
  const location = useLocation();
  const filtersInitialState = location.state && location.state.filters || {};
  const { pageNum } = useParams();
  const [page, setPage] = useState(1);
  const [filters, dispatchFiltersChange] = useReducer(filtersReducer, filtersInitialState);
  const { isLoading, users: { list: data }, users } = useFetchUsers({ page, pageSize, filters });

  /**
   * Get page number value from URL query string
   *
   * @returns {number|undefined}
   */
  const pageNumFromQueryString = useMemo(
    () => pageNum && parseInt(pageNum, 10),
    [pageNum]
  );

  // subscribe to param changes
  useEffect(() => {
    const pageNumber = pageNumFromQueryString;

    if (pageNumber && pageNumber !== page) {
      setPage(pageNumber);
    }
  }, [pageNumFromQueryString, page]);

  const createOnChangeFilter = useCallback(
    filter => value => {
      if (filters[filter] === value) return;

      dispatchFiltersChange({ type: filter, payload: value });
      setPage(1);
      history.push(`${USERS_PAGED_URL}/1`);
    },
    [history, filters]
  );

  const debouncedOnChangeFilter = useCallback(
    debounce(createOnChangeFilter('username'), 250),
    [createOnChangeFilter]
  );

  const onItemClick = useCallback(
    e => {
      if (userCan('change_user') === false) {
        e.preventDefault();
        return;
      }

      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = e;

      if (itemId) {
        history.push(`${USER_URL}/${itemId}`, { filters });
      }
    },
    [history, userCan, filters]
  );

  const onPaginationClick = useCallback(
    pageToNavigateTo => {
      global.window.scrollTo(0, 0);
      history.push(`${USERS_PAGED_URL}/${pageToNavigateTo}`);
    },
    [history]
  );

  const columnHeaders = ['Gebruikersnaam', 'Rol', 'Status'];

  return (
    <Fragment>
      <PageHeader title={`Gebruikers ${users.count ? `(${users.count})` : ''}`}>
        {userCan('add_user') && (
          <HeaderButton variant="primary" $as={Link} to={USER_URL}>
            Gebruiker toevoegen
          </HeaderButton>
        )}
      </PageHeader>

      <Row>
        {isLoading && <LoadingIndicator />}

        <Column span={12} wrap>
          <Column span={12}>
            <DataView
              headers={columnHeaders}
              filters={[
                (
                  <StyledSearchbar
                    placeholder=""
                    onChange={debouncedOnChangeFilter}
                    value={filters.username}
                    data-testid="filterUsersByUsername"
                  />
                ),
              ]}
              columnOrder={columnHeaders}
              invisibleColumns={['id']}
              onItemClick={onItemClick}
              primaryKeyColumn="id"
              data={(!isLoading && data) || []}
            />
          </Column>

          {!isLoading && users.count > 0 && (
            <Column span={12}>
              <StyledPagination
                currentPage={page}
                onClick={onPaginationClick}
                totalPages={Math.ceil(users.count / pageSize)}
              />
            </Column>
          )}
        </Column>
      </Row>
    </Fragment>
  );
};

UsersOverviewContainer.defaultProps = {
  pageSize: 30,
};

UsersOverviewContainer.propTypes = {
  pageSize: PropTypes.number,
  userCan: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userCan: makeSelectUserCan,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(UsersOverviewContainer);
