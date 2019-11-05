import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import Pager from 'components/Pager';

import PageHeader from 'signals/settings/components/PageHeader';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { getAuthHeaders } from 'shared/services/auth/auth';

export const filterData = data => {
  const colMap = {
    id: 'id',
    is_active: 'Status',
    roles: 'Rol',
    username: 'Gebruikersnaam',
  };
  const allowedKeys = Object.keys(colMap);

  return data.map(item =>
    Object.keys(item)
      .filter(key => allowedKeys.includes(key)) // only handle values of valid key entries
      .reduce((rawObj, key) => {
        const obj = { ...rawObj };
        let value = Array.isArray(item[key]) // join array values by a comma
          ? item[key].join(', ')
          : item[key];

        if (typeof value === 'boolean') { // convert boolean value to text
          value = value ? 'Actief' : 'Niet actief';
        }

        obj[colMap[key]] = value;

        return obj;
      }, {})
  );
};

const UsersOverview = ({ page }) => {
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [, setErrors] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response = await fetch(
          `${CONFIGURATION.API_ROOT}signals/v1/private/users/`,
          {
            headers: getAuthHeaders(),
          }
        );
        const userData = await response.json();
        const filteredUserData = filterData(userData.results);

        setUsers(filteredUserData);
        setLoading(false);
      } catch (e) {
        setErrors(e);
      }
    }

    fetchData();
  }, []);

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
