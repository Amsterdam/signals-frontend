import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import './style.scss';

export const HIGHLIGHT_TIMEOUT_INTERVAL = 3000;

class Highlight extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      subscribeTo: props.subscribeTo,
      valueChanged: props.valueChanged,
      show: props.show,
    };

    this.clearHighlight = this.clearHighlight.bind(this);
    this.timer = null;
  }

  static getDerivedStateFromProps(props, state) {
    const valueChanged = !isEqual(props.subscribeTo, state.subscribeTo);
    return {
      subscribeTo: valueChanged ? props.subscribeTo : state.subscribeTo,
      valueChanged,
      show: valueChanged === true ? true : state.show,
    };
  }

  componentDidUpdate() {
    if (this.state.valueChanged) {
      this.timer = global.window.setTimeout(() => {
        this.clearHighlight();
      }, HIGHLIGHT_TIMEOUT_INTERVAL);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      global.window.clearTimeout(this.timer);
    }
  }

  clearHighlight() {
    this.setState({
      valueChanged: false,
      show: false,
    });
  }

  render() {
    const { show } = this.state;
    return (
      <div
        className={`${this.props.className} highlight ${show ? 'highlight--active' : ''}`}
        data-testid="highlight"
      >
        <div className="highlight__children">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Highlight.defaultProps = {
  className: '',
  valueChanged: false,
  show: false,
};

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  subscribeTo: PropTypes.any.isRequired,
  valueChanged: PropTypes.bool,
  show: PropTypes.bool,
};

export default Highlight;
