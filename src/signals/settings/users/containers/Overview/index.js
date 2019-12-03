import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Row, Column, themeSpacing, Button, SearchBar } from '@datapunt/asc-ui';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import Pagination from 'components/Pagination';
import PageHeader from 'signals/settings/components/PageHeader';
import { USERS_PAGED_URL, USER_URL } from 'signals/settings/routes';
import useFetchUsers from './hooks/useFetchUsers';
import DataView, { DataHeader, DataFilter, DataList } from './components/DataView';

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

const UsersOverview = ({ pageSize }) => {
  const history = useHistory();
  const { pageNum } = useParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const { isLoading, users: { list: data }, users } = useFetchUsers({ page, pageSize, filters });

  /**
   * Get page number value from URL query string
   *
   * @returns {number|undefined}
   */
  const pageNumFromQueryString = useMemo(() => pageNum && parseInt(pageNum, 10), [pageNum]);

  // subscribe to param changes
  useEffect(() => {
    const pageNumber = pageNumFromQueryString;

    if (pageNumber && pageNumber !== page) {
      setPage(pageNumber);
    }
  }, [pageNumFromQueryString, page]);

  const createOnChangeFilter = filter => value => {
    // Functionally updating state because it depends on previous state.
    setFilters(state => ({
      ...state,
      [filter]: value,
    }));
  };

  const debouncedOnChangeFilterByEmail = useCallback(debounce(createOnChangeFilter('username'), 250), []);

  const onItemClick = useCallback(e => {
    const {
      currentTarget: {
        dataset: { itemId },
      },
    } = e;

    if (itemId) {
      history.push(`${USER_URL}/${itemId}`);
    }
  }, [history]);

  const onPaginationClick = useCallback(pageToNavigateTo => {
    global.window.scrollTo(0, 0);
    history.push(`${USERS_PAGED_URL}/${pageToNavigateTo}`);
  }, [history]);

  const columnHeaders = ['Gebruikersnaam', 'Rol', 'Status'];

  return (
    <Fragment>
      <PageHeader title={`Gebruikers (${ users.count ? users.count : 0 })`}>
        <HeaderButton variant="primary" $as={Link} to={USER_URL}>
          Gebruiker toevoegen
        </HeaderButton>
      </PageHeader>

      <Row>
        {isLoading && <LoadingIndicator />}

        <Column span={12} wrap>
          <Column span={12}>
            <DataView>
              <DataHeader labels={columnHeaders} />

              <DataFilter headersLength={columnHeaders.length}>
                <StyledSearchbar
                  label="Zoek op emailadres"
                  placeholder="Zoek op emailadres..."
                  onChange={debouncedOnChangeFilterByEmail}
                />
              </DataFilter>

              {!isLoading && data && (
                <DataList
                  columnOrder={columnHeaders}
                  invisibleColumns={['id']}
                  onItemClick={onItemClick}
                  primaryKeyColumn="id"
                  data={data}
                />
              )}
            </DataView>
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

UsersOverview.defaultProps = {
  pageSize: 30,
};

UsersOverview.propTypes = {
  pageSize: PropTypes.number,
};

export default UsersOverview;
