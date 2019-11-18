import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';
import styled from '@datapunt/asc-core';

import makeSelectRolesModel from 'models/roles/selectors';
import { fetchRoles } from 'models/roles/actions';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';

import PageHeader from 'signals/settings/components/PageHeader';
import formatRoles from '../../services/formatRoles';


const StyledListComponent = styled(ListComponent)`
  tr:nth-child(1),
  td:nth-child(1) {
    width: 20%;
  }
`;

export const RolesOverview = ({
  roles: {
    list,
    loading,
  },
  onFetchRoles,
}) => {
  useEffect(() => {
    onFetchRoles();
  }, []);

  return (
    <div>
      <PageHeader title="Rollen" />

      <Row>
        <Column span={12} wrap>
          <Column span={12}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <StyledListComponent
                items={formatRoles(list)}
                invisibleColumns={['id']}
                primaryKeyColumn="id"
              />
            )}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

RolesOverview.defaultProps = {
  roles: {
    list: [],
    loading: false,
  },
};

RolesOverview.propTypes = {
  roles: PropTypes.shape({
    list: PropTypes.array,
    loading: PropTypes.bool,
  }),
  onFetchRoles: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRolesModel,
});

export const mapDispatchToProps = dispatch => bindActionCreators({
  onFetchRoles: fetchRoles,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(RolesOverview);
