import React from 'react';
import PropTypes from 'prop-types';

import PageHeader from 'signals/settings/components/PageHeader';

export const RolesForm = ({
  id,
  list,
  permissions,
}) => {
  console.log('-------------------', permissions);
  const role = list.find(item => item.id === id * 1);
  console.log('role', role);
  return (
    <div>
      <PageHeader title="Rol instellingen" />

      {id}
    </div>
  )
};

RolesForm.defaultProps = {
  list: [],
  permissions: [],
};

RolesForm.propTypes = {
  id: PropTypes.string.isRequired,
  list: PropTypes.array,
  permissions: PropTypes.array,
};

export default RolesForm;
