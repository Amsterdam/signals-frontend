import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './style.scss';

const SplitNotificationBar = ({ payload, onClose }) => (
  <div>
    {payload && payload.id && payload.created && Array.isArray(payload.created) ?
      <div className="split-notification-bar">
        <div className="split-notification-bar__body">
          <button className="split-notification-bar__close-button" onClick={onClose} />

          Melding {payload.id} is gesplitst in
          {payload.created.map((item) =>
            (<span key={item.id} className="split-notification-bar__link">
              &nbsp;<NavLink to={`/manage/incident/${item.id}`}>{item.id}</NavLink>
            </span>)
          )}
        </div>
      </div>
      : ''}
  </div>
);

SplitNotificationBar.propTypes = {
  payload: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ]),
  onClose: PropTypes.func.isRequired
};

export default SplitNotificationBar;
