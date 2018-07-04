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

// const Anchor = (props) => {
//   <a
// }


class Pager extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const currentPage = this.props.page || 1;
    // const totalPages = Math.floor(this.props.incidentsCount / 100) + 1;
    const totalPages = 20;
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;
    const pages = [];
    for (let i = 1; i <= totalPages; ++i) { // eslint-disable-line no-plusplus
      pages.push(
        (currentPage === i) ?
          <a href="" className="pager_step huidige" onClick={() => this.props.onPageChanged(i)}><strong>{i}</strong></a> :
          <a href="" className="pager_step pagina" onClick={() => this.props.onPageChanged(i)}>{i}</a>
      );
    }

    return (
      <div className="pager-">
        <FormattedMessage {...messages.header} />
        Er zijn {this.props.incidentsCount} meldingen gevonden.
        Current Page: {this.props.page || 1}
        Total Pages: {Math.floor(this.props.incidentsCount / 100) + 1}
        <div className="pager">
          {hasPrevious ? <a href="" className="pager_nav vorige" onClick={() => this.props.onPageChanged(currentPage - 1)}>vorige</a> : null}
          {pages.length > 1 ? pages : ''}
          {hasNext ? <a href="" className="pager_nav volgende" onClick={() => this.props.onPageChanged(currentPage + 1)}>volgende</a> : ''}
        </div>

      </div>
    );
  }
}

Pager.propTypes = {
  incidentsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChanged: PropTypes.func.isRequired
};

export default Pager;
