import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Row, Button } from '@datapunt/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import Filter from 'signals/incident-management/containers/Filter';

import FilterTagList from 'signals/incident-management/containers/FilterTagList';
import Modal from 'components/Modal';
import MyFilters from 'signals/incident-management/containers/MyFilters';

const StyledSection = styled.section`
  background-color: #f3f3f3;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 40px;
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
`;

let lastActiveElement = null;

const PageHeader = ({ className, children, title, filter, onClose }) => {
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
    onClose();
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
      if (event.keyCode === 27) {
        closeFilterModal();
        closeMyFiltersModal();
      }
    };
    const openFilterFuntion = () => {
      openFilterModal();
    };

    document.addEventListener('keydown', escFunction);
    document.addEventListener('openFilter', openFilterFuntion);

    return () => {
      document.removeEventListener('keydown', escFunction);
      document.removeEventListener('openFilter', openFilterFuntion);
    };
  });

  return (
    <StyledSection className={className}>
      <Row>
        <Heading $as="h1">{title}</Heading>

        {children}

        <div>
          <StyledButton
            data-testid="modalMyfiltersBtn"
            type="button"
            color="primary"
            $$as="button"
            onClick={openMyFiltersModal}
          >
          Mijn filters
          </StyledButton>

          <StyledButton
            data-testid="modalFilterBtn"
            type="button"
            color="primary"
            $$as="button"
            onClick={openFilterModal}
          >
          Filteren
          </StyledButton>
        </div>

        <Modal isOpen={modalMyFiltersIsOpen} onClose={closeMyFiltersModal} title="Mijn filters">
          <MyFilters onClose={closeMyFiltersModal} />
        </Modal>

        <Modal isOpen={modalFilterIsOpen} onClose={closeFilterModal} title="Filters">
          <Filter onSubmit={closeFilterModal} onCancel={closeFilterModal} />
        </Modal>
      </Row>

      <Row>
        <FilterTagList tags={filter.options} />
      </Row>
    </StyledSection>
  );
};

PageHeader.defaultProps = {
  className: '',
  children: null,
};

PageHeader.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PageHeader;
