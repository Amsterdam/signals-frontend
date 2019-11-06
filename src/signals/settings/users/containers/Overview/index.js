import React, { useState } from 'react';
import { Row, Column } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import Pager from 'components/Pager';

import PageHeader from 'signals/settings/components/PageHeader';
import useFetchUsers from './hooks/useFetchUsers';

const UsersOverview = () => {
  const [page, setPage] = useState(1);
  const { isLoading, users } = useFetchUsers({ page });

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
                onPageChanged={pageNum => {
                  setPage(pageNum);
                }}
              />
            )}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

export default UsersOverview;
