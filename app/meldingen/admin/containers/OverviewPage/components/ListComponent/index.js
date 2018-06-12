/**
*
* ListComponent
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';

class ListComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.selectIncident = this.props.selectIncident.bind(this);
  }

  selectNthIncident = () => { this.props.selectIncident(this.props.incidents[this.props.incidents.length - 1]); }

  render() {
    return (
      <div className="list-component col-md-7">
        <FormattedMessage {...messages.header} />
        <br />There are {this.props.incidents.length} found.
        <br />{JSON.stringify(this.props.incidents)}
        <hr />

        <button className="action primary " onClick={this.selectNthIncident} >
          <span className="value">Select last incident</span>
        </button>
        <hr />
      </div>
    );
  }
}

ListComponent.propTypes = {
  incidents: PropTypes.array.isRequired,
  selectIncident: PropTypes.func.isRequired
};

export default ListComponent;
