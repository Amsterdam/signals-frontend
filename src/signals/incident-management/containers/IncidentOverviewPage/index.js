import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column, Button } from '@datapunt/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import styled from 'styled-components';

import MyFilters from 'signals/incident-management/containers/MyFilters';
import PageHeader from 'containers/PageHeader';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectCategories } from 'containers/App/selectors';
import { makeSelectDataLists, makeSelectActiveFilter } from 'signals/incident-management/selectors';
import { makeSelectQuery } from 'models/search/selectors';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Filter from 'signals/incident-management/containers/Filter';
import Modal from 'components/Modal';
import * as types from 'shared/types';

import makeSelectOverviewPage, { makeSelectIncidentsCount } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { requestIncidents, incidentSelected } from './actions';
import ListComponent from './components/List';
import Pager from './components/Pager';
import FilterTagList from '../FilterTagList';

import './style.scss';

let lastActiveElement = null;

const StyledButton = styled(Button)`
  margin-left: 10px;
`;

export const IncidentOverviewPageContainerComponent = ({
  activeFilter,
  onRequestIncidents,
  overviewpage,
  incidentsCount,
  onIncidentSelected,
  searchQuery,
  dataLists,
}) => {
  const [modalFilterIsOpen, toggleFilterModal] = useState(false);
  const [modalMyFiltersIsOpen, toggleMyFiltersModal] = useState(false);

  const openMyFiltersModal = () => {
    disablePageScroll();
    toggleMyFiltersModal(true);
    lastActiveElement = document.activeElement;
  };

  function closeMyFiltersModal() {
    enablePageScroll();
    toggleMyFiltersModal(false);
    lastActiveElement.focus();
  }

  const openFilterModal = () => {
    disablePageScroll();
    toggleFilterModal(true);
    lastActiveElement = document.activeElement;
  };

  function closeFilterModal() {
    enablePageScroll();
    toggleFilterModal(false);
    lastActiveElement.focus();
  }

  useEffect(() => {
    const escFunction = (event) => {
      /* istanbul ignore next */
      if (event.keyCode === 27) {
        closeFilterModal();
        closeMyFiltersModal();
      }
    };

    document.addEventListener('keydown', escFunction);
    document.addEventListener('openFilter', openFilterModal);

    return () => {
      document.removeEventListener('keydown', escFunction);
      document.removeEventListener('openFilter', openFilterModal);
    };
  });

  useEffect(() => {
    onRequestIncidents(searchQuery ? { filter: { searchQuery } } : {});
  }, []);

  const { incidents, loading, page, sort } = overviewpage;

  return (
    <div className="incident-overview-page">
      <PageHeader>
        <div>
          <StyledButton
            data-testid="myFiltersModalBtn"
            color="primary"
            onClick={openMyFiltersModal}
          >
            Mijn filters
          </StyledButton>

          <StyledButton
            data-testid="filterModalBtn"
            color="primary"
            onClick={openFilterModal}
          >
            Filteren
          </StyledButton>
        </div>

        <Modal
          data-testid="myFiltersModal"
          isOpen={modalMyFiltersIsOpen}
          onClose={closeMyFiltersModal}
          title="Mijn filters"
        >
          <MyFilters onClose={closeMyFiltersModal} />
        </Modal>

        <Modal
          data-testid="filterModal"
          isOpen={modalFilterIsOpen}
          onClose={closeFilterModal}
          title="Filters"
        >
          <Filter onSubmit={closeFilterModal} onCancel={closeFilterModal} />
        </Modal>

        <FilterTagList tags={activeFilter.options} />
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
                {...dataLists}
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
    </div>
  );
};

IncidentOverviewPageContainerComponent.defaultProps = {
  activeFilter: {},
};

IncidentOverviewPageContainerComponent.propTypes = {
  activeFilter: types.filterType,
  overviewpage: types.overviewPageType.isRequired,
  dataLists: types.dataListsType.isRequired,
  categories: types.categoriesType.isRequired,
  incidentsCount: PropTypes.number,
  searchQuery: PropTypes.string,

  onRequestIncidents: PropTypes.func.isRequired,
  onIncidentSelected: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  categories: makeSelectCategories(),
  dataLists: makeSelectDataLists,
  incidentsCount: makeSelectIncidentsCount,
  overviewpage: makeSelectOverviewPage(),
  searchQuery: makeSelectQuery,
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
