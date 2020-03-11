import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Row, Column, themeSpacing, Button, SearchBar } from '@datapunt/asc-ui';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import { PAGE_SIZE } from 'containers/App/constants';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Pagination from 'components/Pagination';
import PageHeader from 'signals/settings/components/PageHeader';
import DataView from 'components/DataView';
import { USERS_PAGED_URL, USER_URL } from 'signals/settings/routes';
import SettingsContext from 'signals/settings/context';
import { setUserFilters } from 'signals/settings/actions';
import { makeSelectUserCan } from 'containers/App/selectors';
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

const StyledDataView = styled(DataView)`
  th:first-child {
    width: 50%;
  }
`;

const UsersOverviewContainer = () => {
  const history = useHistory();
  const { pageNum } = useParams();
  const [page, setPage] = useState(1);
  const { state, dispatch } = useContext(SettingsContext);
  const { filters } = state.users;
  const {
    isLoading,
    users: { list: data },
    users,
  } = useFetchUsers({ page, filters });
  const userCan = useSelector(makeSelectUserCan);

  /**
   * Get page number value from URL query string
   *
   * @returns {number|undefined}
   */
  const pageNumFromQueryString = pageNum && parseInt(pageNum, 10);

  // subscribe to param changes
  useEffect(() => {
    if (pageNumFromQueryString && pageNumFromQueryString !== page) {
      setPage(pageNumFromQueryString);
    }
  }, [pageNumFromQueryString, page]);

  const createOnChangeFilter = useCallback(
    filter => value => {
      if (filters[filter] === value) return;

      dispatch(setUserFilters({ username: value }));
      setPage(1);
      history.push(`${USERS_PAGED_URL}/1`);
    },
    [dispatch, history, filters]
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
        history.push(`${USER_URL}/${itemId}`);
      }
    },
    [history, userCan]
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
            <StyledDataView
              headers={columnHeaders}
              filters={[
                <StyledSearchbar
                  placeholder=""
                  onChange={debouncedOnChangeFilter}
                  value={filters.username}
                  data-testid="filterUsersByUsername"
                />,
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

export default UsersOverviewContainer;
