/**
*
* ListComponent
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';

class ListComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  selectIncident = (incident) => () => {
    this.props.incidentSelected(incident);
  }

  render() {
    return (
      <div className="list-component col-md-12">
        <FormattedMessage {...messages.header} />
        <br />There are {this.props.incidents.length} found.
        <hr />
        <table className="" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="">Naam</th>
              <th className="">User</th>
            </tr>
          </thead>
          <tbody>
            {this.props.incidents.map((incident) => (
              <tr key={incident.id} onClick={this.selectIncident(incident)}>
                <td>{incident.id}</td>
                <td>{incident.user}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

ListComponent.propTypes = {
  incidents: PropTypes.array.isRequired,
  incidentSelected: PropTypes.func.isRequired,
};

// export default withRouter(ListComponent);
export default withRouter(ListComponent);
