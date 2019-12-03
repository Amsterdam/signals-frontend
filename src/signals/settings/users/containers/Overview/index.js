import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Row, Column, themeSpacing, Button } from '@datapunt/asc-ui';
import styled from 'styled-components';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import Pagination from 'components/Pagination';
import PageHeader from 'signals/settings/components/PageHeader';
import { USERS_PAGED_URL, USER_URL } from 'signals/settings/routes';
import useFetchUsers from './hooks/useFetchUsers';
import DataView, { DataHeader, DataList } from './components/DataView';

const StyledPagination = styled(Pagination)`
  margin-top: ${themeSpacing(12)};
`;

const HeaderButton = styled(Button)`
  &:hover {
    color: white;
  }
`;

const UsersOverview = ({ pageSize }) => {
  const history = useHistory();
  const { pageNum } = useParams();
  const [page, setPage] = useState(1);
  const { isLoading, users: { list: data }, users } = useFetchUsers({ page, pageSize });

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
