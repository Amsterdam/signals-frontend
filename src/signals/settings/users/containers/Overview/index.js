import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import Pager from 'components/Pager';

import PageHeader from 'signals/settings/components/PageHeader';
import useFetchUsers from './hooks/useFetchUsers';


const UsersOverview = ({ page }) => {
  const { isLoading, users } = useFetchUsers();

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
                onPageChanged={() => {}}
              />
            )}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

UsersOverview.defaultProps = {
  page: 1,
};

UsersOverview.propTypes = {
  page: PropTypes.number,
};

export default UsersOverview;
