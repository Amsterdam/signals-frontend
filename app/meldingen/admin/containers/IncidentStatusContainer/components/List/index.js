import React from 'react';
import PropTypes from 'prop-types';


import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import './style.scss';

class List extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="list-component">
        <div className="list-component__body">
          <table className="" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="">Datum</th>
                <th className="">Tijd</th>
                <th className="">Status</th>
                <th className="">Omschrijving</th>
                <th className="">Gebruiker</th>
              </tr>
            </thead>
            <tbody>
              {this.props.statusList.map((item) => (
                <tr key={item.id}>
                  <td>{string2date(item.created_at)}</td>
                  <td>{string2time(item.created_at)}</td>
                  <td>{item.state}</td>
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
  statusList: PropTypes.array.isRequired
};

List.defaultProps = {
  statusList: []
};

export default List;

