import React from 'react';
import PropTypes from 'prop-types';

class Thor extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.sendToThor = this.sendToThor.bind(this);
  }

  sendToThor = () => {
    const status = {
      _signal: this.props.id,
      state: 'ready to send',
      text: 'Te verzenden naar THOR',
      target_api: 'sigmax'
    };

    this.props.onRequestStatusCreate(status);
  }

  render() {
    const { currentState, loading } = this.props;
    const cannotSend = !['m', 'i', 'b', 'h', 'send failed'].some((value) => value === currentState);
    return (
      <button className="incident-status-add__send action tertiair" type="button" onClick={this.sendToThor} disabled={cannotSend}>
        <span className="value">THOR</span>
        {loading ?
          <span className="working">
            <div className="progress-indicator progress-blue"></div>
          </span>
        : ''}
      </button>
    );
  }
}

Thor.defaultProps = {
  loading: false
};

Thor.propTypes = {
  currentState: PropTypes.string,
  id: PropTypes.string,
  loading: PropTypes.bool,

  onRequestStatusCreate: PropTypes.func.isRequired
};

export default Thor;
