import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class Tabs extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { tabs, selectedTab } = this.props;
    const tabsList = tabs.map((name, index) => (
      <li role="presentation" key={`key${name}`} className={selectedTab === index ? 'selected' : ''} onClick={() => this.props.onTabChanged(index)}>
        <a>{name}</a>
      </li>)
    );
    return (
      <div className="incident-detail-tabs">
        <ul className="tabs">
          {tabsList}
        </ul>
      </div>
    );
  }
}

Tabs.propTypes = {
  tabs: PropTypes.array,
  selectedTab: PropTypes.number,
  onTabChanged: PropTypes.func
};

export default Tabs;
