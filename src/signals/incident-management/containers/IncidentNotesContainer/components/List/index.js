import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import './style.scss';

class List extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { incidentNotesList } = this.props;
    return (
      <div className="incident-notes-container-list">
        <div className="incident-notes-container-list__body">
          <table className="incident-notes-container-list__body-list" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="">Datum</th>
                <th className="">Tijd</th>
                <th className="">Notitie</th>
                <th className="">Gebruiker</th>
              </tr>
            </thead>
            <tbody>
              {incidentNotesList.map((item) => (
                <tr key={item._links.self.href}>
                  <td>{string2date(item.created_at)}</td>
                  <td>{string2time(item.created_at)}</td>
                  <td>{item.state_display}</td>
                  <td>{item.text}</td>
                  <td>{item.user}</td>
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
  incidentNotesList: PropTypes.array.isRequired,
};

List.defaultProps = {
  incidentNotesList: []
};

export default List;
