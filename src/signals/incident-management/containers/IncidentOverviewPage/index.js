import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column, Button } from '@datapunt/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import PageHeader from 'containers/PageHeader';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  makeSelectLoading,
  makeSelectError,
  makeSelectCategories,
} from 'containers/App/selectors';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Filter from 'signals/incident-management/containers/Filter';
import Modal from 'components/Modal';
import makeSelectOverviewPage, { makeSelectIncidentsCount } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { requestIncidents, incidentSelected } from './actions';
import ListComponent from './components/List';
import Pager from './components/Pager';

let lastActiveElement = null;

export const IncidentOverviewPageContainerComponent = ({
  onRequestIncidents,
  overviewpage,
  incidentsCount,
  onIncidentSelected,
}) => {
  const [modalIsOpen, toggleModal] = useState(false);

  const openModal = () => {
    disablePageScroll();
    toggleModal(true);
    lastActiveElement = document.activeElement;
  };

  function closeModal() {
    enablePageScroll();
    toggleModal(false);
    lastActiveElement.focus();
  }

  useEffect(() => {
    const escFunction = (event) => {
      /* istanbul ignore else */
      if (event.keyCode === 27) {
        closeModal();
      }
    };

    document.addEventListener('keydown', escFunction);

    return () => {
      document.removeEventListener('keydown', escFunction);
    };
  });

  useEffect(() => {
    onRequestIncidents({});
  }, []);

  const { incidents, loading, page, sort, ...rest } = overviewpage;

  return (
    <Fragment>
      <PageHeader>
        <Button
          data-testid="modalBtn"
          type="button"
          color="primary"
          onClick={openModal}
        >
          Filteren
        </Button>

        <Modal isOpen={modalIsOpen} onClose={closeModal} title="Filters">
          <Filter onSubmit={closeModal} onCancel={closeModal} />
        </Modal>
      </PageHeader>

      <Row>
        <Column span={12} wrap>
          <Column span={12}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <ListComponent
                incidentSelected={onIncidentSelected}
                incidents={incidents}
                onRequestIncidents={onRequestIncidents}
                sort={sort}
                incidentsCount={incidentsCount}
                {...rest}
              />
            )}
          </Column>

          <Column span={12}>
            {!loading && (
              <Pager
                incidentsCount={incidentsCount}
                page={page}
                onRequestIncidents={onRequestIncidents}
              />
            )}
          </Column>
        </Column>
      </Row>
    </Fragment>
  );
};

IncidentOverviewPageContainerComponent.propTypes = {
  overviewpage: PropTypes.shape({
    incidents: PropTypes.arrayOf(PropTypes.shape({})),
    loading: PropTypes.bool,
    page: PropTypes.number,
    sort: PropTypes.string,
  }).isRequired,
  categories: PropTypes.shape({}).isRequired,
  incidentsCount: PropTypes.number,

  onRequestIncidents: PropTypes.func.isRequired,
  onIncidentSelected: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  overviewpage: makeSelectOverviewPage(),
  incidentsCount: makeSelectIncidentsCount,
  categories: makeSelectCategories(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onRequestIncidents: requestIncidents,
      onIncidentSelected: incidentSelected,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'incidentOverviewPage', reducer });
const withSaga = injectSaga({ key: 'incidentOverviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentOverviewPageContainerComponent);
