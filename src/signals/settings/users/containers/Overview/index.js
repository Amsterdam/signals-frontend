import React, { useState, useEffect } from "react";import PropTypes from 'prop-types';
import { Row, Column } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import Pager from 'components/Pager';

import PageHeader from 'signals/settings/components/PageHeader';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { getAuthHeaders } from 'shared/services/auth/auth';

const UsersOverview = ({ loading, page, onPageUsersChanged }) => {
  const [users, setUsers] = useState({});
  const [, setErrors] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${CONFIGURATION.API_ROOT}signals/v1/private/users/`, {
          headers: getAuthHeaders(),
        });
        const userData = await response.json();

        setUsers(userData);
      } catch (e) {
        setErrors(e);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="users-overview-page">
      <PageHeader title={`Gebruikers (${users.count})`} />

      <Row>
        <Column span={12} wrap>
          <Column span={12}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <ListComponent />
            )}
          </Column>

          <Column span={12}>
            {!loading && users.count && (
              <Pager
                itemCount={users.count}
                page={page}
                onPageChanged={onPageUsersChanged}
              />
            )}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

UsersOverview.defaultProps = {
  loading: true,
  onPageUsersChanged: () => {},
  page: 1,
};

UsersOverview.propTypes = {
  loading: PropTypes.bool,
  onPageUsersChanged: PropTypes.func,
  page: PropTypes.number,
};

export default UsersOverview;
