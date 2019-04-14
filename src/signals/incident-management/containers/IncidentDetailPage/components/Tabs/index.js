import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import './style.scss';

class Tabs extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { tabs, selectedTab } = this.props;
    return (
      <div className="detail-tabs">
        <ul className="detail-tabs__list">
          {map(tabs, (tab, index) => (
            tab ?
              <li role="presentation" key={`key-${tab.name}`} className={`detail-tabs__item ${selectedTab === index ? 'detail-tabs__item--selected' : ''}`} onClick={() => this.props.onTabChanged(index)}>
                <a role="presentation" className={`detail-tabs__tab ${selectedTab === index ? 'detail-tabs__tab--selected' : ''}`} onClick={() => this.props.onTabChanged(index)}>{tab.name}</a>
              </li>
            : ''
            )
          )}
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
