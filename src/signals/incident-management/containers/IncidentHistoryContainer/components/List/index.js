import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import './style.scss';

class List extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { incidentHistoryList } = this.props;
    return (
      <div className="incident-history-container-list">
        <div className="incident-history-container-list__body">
          <table className="incident-history-container-list__body-list" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="">Wanneer</th>
                <th className="">Wat</th>
                <th className="">Omschrijving</th>
                <th className="">Gebruiker</th>
              </tr>
            </thead>
            <tbody>
              {incidentHistoryList.map((item) => (
                <tr key={item.identifier}>
                  <td>{string2date(item.when)} om {string2time(item.when)}</td>
                  <td>{item.action}</td>
                  <td className="pre-wrap">{item.description}</td>
                  <td>{item.who}</td>
                </tr>
              ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

List.propTypes = {
  incidentHistoryList: PropTypes.array.isRequired,
};

List.defaultProps = {
  incidentHistoryList: []
};

export default List;
