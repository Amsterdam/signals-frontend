import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback, useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, useLocation, Link } from 'react-router-dom';
import { Row, Column, themeSpacing, Button, SearchBar , Select } from '@datapunt/asc-ui';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import debounce from 'lodash/debounce';


import { PAGE_SIZE } from 'containers/App/constants';
import { makeSelectUserCan } from 'containers/App/selectors';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Pagination from 'components/Pagination';
import PageHeader from 'signals/settings/components/PageHeader';
import DataView from 'components/DataView';
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
      return { ...action.prevState, username: action.payload };
    case 'is_active':
      let value;
      if (action.payload === 'inactive') {
        value = false;
      } else if (action.payload === 'active') {
        value = true;
      } else if (action.payload === 'all') {
        value = null;
      } else {
        throw new Error(`value is invalid: ${action.value} (action type: ${action.type})`);
      }

      return { ...action.prevState, is_active: value };
    default:
      throw new Error(`action.type is unknown: ${action.type}`);
  }
};

const StyledDataView = styled(DataView)`
  th:first-child {
    width: 50%;
  }
`;

export const UsersOverviewContainer = ({ userCan }) => {
  const history = useHistory();

  const location = useLocation();
  const filtersInitialState = location.state && location.state.filters || {};

  const { pageNum } = useParams();
  const [page, setPage] = useState(1);
  const [filters, dispatchFiltersChange] = useReducer(filtersReducer, filtersInitialState);
  const { isLoading, users: { list: data }, users } = useFetchUsers({ page, filters });
  const [userActiveState, setUserActiveState] = React.useState('all');

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

      dispatchFiltersChange({ type: filter, payload: value, prevState: filters });

      setPage(1);
      history.push(`${USERS_PAGED_URL}/1`);
    },
    [history, filters]
  );

  const debouncedOnChangeUsernameFilter = useCallback(
    debounce(createOnChangeFilter('username'), 250),
    [createOnChangeFilter]
  );

  const onItemClick = useCallback(
    event => {
      if (userCan('change_user') === false) {
        event.preventDefault();
        return;
      }

      const { currentTarget: { dataset: { itemId } } } = event;
      if (itemId) {history.push(`${USER_URL}/${itemId}`, { filters });}
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

  const userActiveFilter = createOnChangeFilter('is_active');

  const userStatusOnChangeHandler = event => {
    event.preventDefault();

    setUserActiveState(event.target.value);
    userActiveFilter(event.target.value);
  };

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
            <StyledDataView
              headers={columnHeaders}
              filters={[
                (
                  <React.Fragment>
                    <StyledSearchbar
                      placeholder=""
                      onChange={debouncedOnChangeUsernameFilter}
                      value={filters.username}
                      data-testid="filterUsersByUsername"
                    />

                    <Select value={userActiveState} onChange={userStatusOnChangeHandler}>
                      <option value="all">Alle</option>
                      <option value="active">Actief</option>
                      <option value="inactive">Niet actief</option>
                    </Select>
                  </React.Fragment>
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
                totalPages={Math.ceil(users.count / PAGE_SIZE)}
              />
            </Column>
          )}
        </Column>
      </Row>
    </Fragment>
  );
};

UsersOverviewContainer.propTypes = {
  userCan: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userCan: makeSelectUserCan,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(UsersOverviewContainer);
