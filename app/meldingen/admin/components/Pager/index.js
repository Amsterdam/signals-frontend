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
    return (
      <div className="pager">
        <FormattedMessage {...messages.header} />
        Er zijn {this.props.incidentsCount} meldingen gevonden.
        Current Page: {this.props.page}
        Total Pages: {Math.floor(this.props.incidentsCount / 100) + 1 }
      </div>
    );
  }
}

Pager.propTypes = {
  incidentsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired
};

export default Pager;
