/**
*
* Pager
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import './style.scss';

class Pager extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const currentPage = this.props.page || 1;
    const totalPages = Math.floor(this.props.incidentsCount / 100) + 1;
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;
    const pages = [...Array(totalPages).keys()].map((page) => {
      const i = page + 1;
      return ((currentPage === i) ?
        <span role="presentation" key={i} className="pager_step huidige" onClick={() => this.props.onPageChanged(i)}><strong>{i}</strong></span> :
        <a role="presentation" key={i} className="pager_step pagina" onClick={() => this.props.onPageChanged(i)}>{i}</a>
      );
    });

    return (
      <div className="incidents-list-pager" >
        <div className="pager">
          {hasPrevious ? <a role="presentation" className="pager_nav vorige" onClick={() => this.props.onPageChanged(currentPage - 1)}><FormattedMessage {...messages.previous} /></a> : null}
          {pages.length > 1 ? pages : ''}
          {hasNext ? <a role="presentation" className="pager_nav volgende" onClick={() => this.props.onPageChanged(currentPage + 1)}><FormattedMessage {...messages.next} /></a> : ''}
        </div>
      </div >
    );
  }
}

Pager.propTypes = {
  page: PropTypes.number,
  onPageChanged: PropTypes.func.isRequired,
  incidentsCount: PropTypes.number
};

Pager.defaultProps = {
  incidentsCount: 0,
  page: 1
};

export default Pager;
