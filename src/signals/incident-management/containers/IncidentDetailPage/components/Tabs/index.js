import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import './style.scss';

class Tabs extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { tabs, selectedTab } = this.props;
    const tabsList = map(tabs, (tab, index) => (
      tab ?
        <li role="presentation" key={`key-${tab.name}`} className={selectedTab === index ? 'selected' : ''} onClick={() => this.props.onTabChanged(index)}>
          <a className="tab">{tab.name} {tab.count ? <span className="pill">{tab.count}</span> : ''}</a>
        </li>
      : ''
      )
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
  tabs: PropTypes.object,
  selectedTab: PropTypes.string,
  onTabChanged: PropTypes.func
};

export default Tabs;
