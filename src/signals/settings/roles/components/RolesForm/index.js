import React from 'react';
import PropTypes from 'prop-types';

import LoadingIndicator from 'shared/components/LoadingIndicator';

import PageHeader from 'signals/settings/components/PageHeader';

export const RolesForm = ({
  id,
  loading,
}) => {
  console.log('-------------------', id);
  return (
    <div>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <PageHeader title="Rol instellingen" />

          {id}
        </div>
      )}
    </div >
  )
};

RolesForm.defaultProps = {
  loading: false,
};

RolesForm.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

export default RolesForm;
