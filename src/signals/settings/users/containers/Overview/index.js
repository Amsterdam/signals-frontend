import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import Pager from 'components/Pager';

import PageHeader from 'signals/settings/components/PageHeader';
import useFetchUsers from './hooks/useFetchUsers';

const UsersOverview = () => {
  const history = useHistory();
  const location = useLocation();
  const pageSize = 30;

  const [page, setPage] = useState(1);
  const { isLoading, users } = useFetchUsers({ page, pageSize });

  const getPageNum = () => {
    const [, pageNum] = location.search.match(/page=(\d+)/) || [];

    return pageNum && parseInt(pageNum, 10);
  };

  useEffect(() => {
    if (history.action === 'POP') {
      return;
    }

    const pageNumber = getPageNum();

    if (!pageNumber) {
      history.replace(`${location.pathname}/?page=1`);
    } else if (pageNumber !== page) {
      history.push(`${location.pathname}?page=${page}`);
    }
  }, [page]);

  useEffect(() => {
    const pageNumber = getPageNum();

    if (pageNumber && pageNumber !== page) {
      setPage(pageNumber);
    }
  }, [location]);

  return (
    <div className="users-overview-page">
      <PageHeader title={`Gebruikers (${users.length})`} />

      <Row>
        <Column span={12} wrap>
          <Column span={12}>
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <ListComponent
                items={users}
                invisibleColumns={['id']}
                primaryKeyColumn="id"
                columnOrder={['Gebruikersnaam', 'Rol', 'Status']}
              />
            )}
          </Column>

          <Column span={12}>
            {!isLoading && users.length && (
              <Pager
                itemCount={users.length}
                page={page}
                onPageChanged={pageNumber => {
                  history.push(`${location.pathname}?page=${pageNumber}`);
                }}
                pageSize={pageSize}
              />
            )}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

export default UsersOverview;
