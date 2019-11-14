import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column, Button, themeSpacing } from '@datapunt/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import styled from 'styled-components';

import MyFilters from 'signals/incident-management/containers/MyFilters';
import PageHeader from 'containers/PageHeader';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectCategories } from 'containers/App/selectors';
import {
  makeSelectDataLists,
  makeSelectActiveFilter,
  makeSelectPage,
  makeSelectOrdering,
} from 'signals/incident-management/selectors';
import {
  pageIncidentsChanged,
  orderingIncidentsChanged,
} from 'signals/incident-management/actions';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Filter from 'signals/incident-management/containers/Filter';
import Modal from 'components/Modal';
import Pagination from 'components/Pagination';
import * as types from 'shared/types';
import { FILTER_PAGE_SIZE } from 'signals/incident-management/constants';

import { makeSelectOverviewPage, makeSelectIncidentsCount } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { requestIncidents, incidentSelected } from './actions';
import ListComponent from './components/List';
import FilterTagList from '../FilterTagList';

import './style.scss';

let lastActiveElement = null;

const StyledButton = styled(Button)`
  margin-left: 10px;
`;

const StyledPagination = styled(Pagination)`
  margin-top: ${themeSpacing(12)};
`;

export const IncidentOverviewPageContainerComponent = ({
  activeFilter,
  onRequestIncidents,
  onPageIncidentsChanged,
  overviewpage,
  incidentsCount,
  onIncidentSelected,
  dataLists,
  page,
  ordering,
  onChangeOrdering,
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
    const escFunction = event => {
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
    onRequestIncidents();
  }, []);

  const { incidents, loading } = overviewpage;

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
                onChangeOrdering={onChangeOrdering}
                sort={ordering}
                incidentsCount={incidentsCount}
                {...dataLists}
              />
            )}
          </Column>

          <Column span={12}>
            {!loading && incidentsCount && (
              <StyledPagination
                currentPage={page}
                hrefPrefix="/manage/incidents?page="
                onClick={pageToNavigateTo => {
                  global.window.scrollTo(0, 0);
                  onPageIncidentsChanged(pageToNavigateTo);
                }}
                totalPages={Math.ceil(incidentsCount / FILTER_PAGE_SIZE)}
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
  page: 1,
};

IncidentOverviewPageContainerComponent.propTypes = {
  activeFilter: types.filterType,
  categories: types.categoriesType.isRequired,
  dataLists: types.dataListsType.isRequired,
  incidentsCount: PropTypes.number,
  onChangeOrdering: PropTypes.func.isRequired,
  onIncidentSelected: PropTypes.func.isRequired,
  onPageIncidentsChanged: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  ordering: PropTypes.string,
  overviewpage: types.overviewPageType.isRequired,
  page: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  categories: makeSelectCategories(),
  dataLists: makeSelectDataLists,
  incidentsCount: makeSelectIncidentsCount,
  ordering: makeSelectOrdering,
  overviewpage: makeSelectOverviewPage,
  page: makeSelectPage,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onChangeOrdering: orderingIncidentsChanged,
      onIncidentSelected: incidentSelected,
      onPageIncidentsChanged: pageIncidentsChanged,
      onRequestIncidents: requestIncidents,
    },
    dispatch
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'incidentOverviewPage', reducer });
const withSaga = injectSaga({ key: 'incidentOverviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(IncidentOverviewPageContainerComponent);
