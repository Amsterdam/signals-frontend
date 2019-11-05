/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const PAGE_NUMBER_PADDING = 2;

class Pager extends React.Component {
  constructor(props) {
    super(props);
    this.onPageChanged = this.onPageChanged.bind(this);
  }

  onPageChanged(page) {
    this.props.onPageChanged(page);
  }

  render() {
    const currentPage = this.props.page;
    const totalPages = Math.floor(this.props.itemCount / this.props.itemsPerPage) + 1;
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;
    let showDots = true;
    const pages = [...Array(totalPages).keys()].map(page => {
      const i = page + 1;

      if (
        Math.abs(currentPage - i) <= PAGE_NUMBER_PADDING ||
        i <= PAGE_NUMBER_PADDING + 1 ||
        i >= totalPages - PAGE_NUMBER_PADDING
      ) {
        showDots = true;
        return currentPage === i ? (
          <span role="presentation" key={i} className="pager_step huidige">
            <strong>{i}</strong>
          </span>
        ) : (
          <a
            role="presentation"
            key={i}
            className="pager_step pagina"
            onClick={() => this.onPageChanged(i)}>
            {i}
          </a>
        );
      }
      if (showDots) {
        showDots = false;
        return (
          <span role="presentation" key={i} className="pager_step puntjes">
            <strong>...</strong>
          </span>
        );
      }

      return '';
    });

    return (
      <div className="list-pager" data-testid="overviewPagerComponent">
        <div className="pager">
          {hasPrevious && (
            <a
              role="presentation"
              className="pager_nav vorige"
              onClick={() => this.onPageChanged(currentPage - 1)}>
              vorige
            </a>
          )}
          {pages.length > 1 ? pages : ''}
          {hasNext && (
            <a
              role="presentation"
              className="pager_nav volgende"
              onClick={() => this.onPageChanged(currentPage + 1)}>
              volgende
            </a>
          )}
        </div>
      </div>
    );
  }
}

Pager.defaultProps = {
  itemCount: 0,
  itemsPerPage: 100,
  page: 1,
};

Pager.propTypes = {
  itemCount: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChanged: PropTypes.func.isRequired,
  page: PropTypes.number,
};

export default Pager;
