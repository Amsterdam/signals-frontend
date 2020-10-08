import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Row, Column, themeSpacing, Button, SearchBar } from '@datapunt/asc-ui';
import styled from 'styled-components';

import useDebounce from 'hooks/useDebounce';
import { PAGE_SIZE } from 'containers/App/constants';
import LoadingIndicator from 'components/LoadingIndicator';
import Pagination from 'components/Pagination';
import PageHeader from 'signals/settings/components/PageHeader';
import DataView from 'components/DataView';
import { USERS_PAGED_URL, USER_URL } from 'signals/settings/routes';
import SettingsContext from 'signals/settings/context';
import { setUserFilters } from 'signals/settings/actions';
import { inputSelectRolesSelector } from 'models/roles/selectors';
import { makeSelectUserCan } from 'containers/App/selectors';
import SelectInput from 'components/SelectInput';
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

const selectUserActive = [
  { key: 'all', name: 'Alles', value: '*' },
  { key: 'active', name: 'Actief', value: true },
  { key: 'inactive', name: 'Niet actief', value: false },
];

const UsersOverviewContainer = () => {
  const history = useHistory();
  const { pageNum } = useParams();
  const [page, setPage] = useState(1);
  const { state, dispatch } = useContext(SettingsContext);
  const { filters } = state.users;
  const {
    isLoading,
    users: { list: data, count },
  } = useFetchUsers({ page, filters });
  const userCan = useSelector(makeSelectUserCan);
  const selectRoles = useSelector(inputSelectRolesSelector);

  /**
   * Get page number value from URL query string
   *
   * @returns {number|undefined}
   */
  const pageNumFromQueryString = pageNum && Number.parseInt(pageNum, 10);

  // subscribe to param changes
  useEffect(() => {
    if (pageNumFromQueryString && pageNumFromQueryString !== page) {
      setPage(pageNumFromQueryString);
    }
  }, [pageNumFromQueryString, page]);

  const setUsernameFilter = useCallback(
    value => {
      dispatch(setUserFilters({ username: value }));
      setPage(1);
      history.push(`${USERS_PAGED_URL}/1`);
    },
    [dispatch, history]
  );

  const createOnChangeFilter = useCallback(
    event => {
      const { value } = event.target;

      setUsernameFilter(value);
    },
    [setUsernameFilter]
  );

  const debouncedOnChangeFilter = useDebounce(createOnChangeFilter, 250);

  const selectUserActiveOnChange = useCallback(
    event => {
      event.preventDefault();
      dispatch(setUserFilters({ is_active: event.target.value }));
    },
    [dispatch]
  );

  const selectRoleOnChange = useCallback(
    event => {
      event.preventDefault();
      dispatch(setUserFilters({ role: event.target.value }));
    },
    [dispatch]
  );

  const onItemClick = useCallback(
    event => {
      if (userCan('change_user') === false) {
        event.preventDefault();
        return;
      }

      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = event;

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
      <PageHeader title={`Gebruikers${count ? ` (${count})` : ''}`}>
        {userCan('add_user') && (
          <HeaderButton variant="primary" forwardedAs={Link} to={USER_URL}>
            Gebruiker toevoegen
          </HeaderButton>
        )}
      </PageHeader>

      <Row data-testid="usersOverview">
        {isLoading && <LoadingIndicator />}

        <Column span={12} wrap>
          <Column span={12}>
            <StyledDataView
              headers={columnHeaders}
              filters={[
                <StyledSearchbar
                  placeholder=""
                  onChange={event => {
                    event.persist();
                    debouncedOnChangeFilter(event);
                  }}
                  onClear={() => setUsernameFilter('')}
                  value={filters.username}
                  data-testid="filterUsersByUsername"
                />,

                <SelectInput
                  name="roleSelect"
                  value={filters.role}
                  options={selectRoles}
                  onChange={selectRoleOnChange}
                />,

                <SelectInput
                  name="userActiveSelect"
                  value={filters.userActive}
                  options={selectUserActive}
                  onChange={selectUserActiveOnChange}
                />,
              ]}
              columnOrder={columnHeaders}
              invisibleColumns={['id']}
              onItemClick={onItemClick}
              primaryKeyColumn="id"
              data={(!isLoading && data?.length > 0 && data) || []}
            />
          </Column>

          {!isLoading && count > 0 && (
            <Column span={12}>
              <StyledPagination
                currentPage={page}
                onClick={onPaginationClick}
                totalPages={Math.ceil(count / PAGE_SIZE)}
              />
            </Column>
          )}
        </Column>
      </Row>
    </Fragment>
  );
};

export default UsersOverviewContainer;
