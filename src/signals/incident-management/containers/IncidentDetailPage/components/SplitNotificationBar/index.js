import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './style.scss';

const SplitNotificationBar = ({ data, onClose }) => (
  <div>
    {data && data.id && data.created && data.created.children && Array.isArray(data.created.children) ?
      <div className="split-notification-bar success">
        <div className="split-notification-bar__body">
          <button className="split-notification-bar__close-button" onClick={onClose} />

          Melding {data.id} is gesplitst in
          {data.created.children.map((item) =>
            (<span key={item.id} className="split-notification-bar__link">
              &nbsp;<NavLink to={`/manage/incident/${item.id}`}>{item.id}</NavLink>
            </span>)
          )}
        </div>
      </div>
      : ''}
    {data && data.response && data.response.status ?
      <div className="split-notification-bar error">
        <div className="split-notification-bar__body">
          <button className="split-notification-bar__close-button" onClick={onClose} />

          De melding is helaas niet gesplitst.&nbsp;
          {data.response.status === 412 ? 'U kunt geen meldingen splitsen die al gesplitst zijn.' : 'Er is een onbekende fout ontstaan.'}
        </div>
      </div>
        : ''}
  </div>
);

SplitNotificationBar.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ]),
  onClose: PropTypes.func.isRequired
};

export default SplitNotificationBar;
