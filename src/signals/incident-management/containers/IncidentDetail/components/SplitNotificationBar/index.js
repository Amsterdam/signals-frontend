import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './style.scss';

const getErrorMessage = status => {
  switch (status) {
    case 403:
      return 'U bent niet bevoegd om deze melding te splitsen.';

    case 412:
      return 'U kunt geen meldingen splitsen die al gesplitst zijn.';

    default:
      return 'Er is een onbekende fout ontstaan.';
  }
};

const SplitNotificationBar = ({ data, onDismissSplitNotification }) => (
  <div data-testid="split-notification-bar">
    {data && data.id && data.created && data.created.children && Array.isArray(data.created.children)
      ? (
        <div className="split-notification-bar success">
          <div className="split-notification-bar__body">
            <button
              className="split-notification-bar__close-button"
              type="button"
              data-testid="split-notification-bar-close-button"
              onClick={onDismissSplitNotification}
            />

          Melding
            {' '}
            {data.id}
            {' '}
is gesplitst in
            {data.created.children.map(item => (
              <span key={item.id} className="split-notification-bar__link">
                <NavLink to={`/manage/incident/${item.id}`}>{item.id}</NavLink>
              </span>
            ))}
          </div>
        </div>
      )
      : ''}
    {data && data.response && data.response.status
      ? (
        <div className="split-notification-bar error">
          <div className="split-notification-bar__body">
            <button
              className="split-notification-bar__close-button"
              type="button"
              data-testid="split-notification-bar-close-button"
              onClick={onDismissSplitNotification}
            />

          De melding is helaas niet gesplitst.&nbsp;
            {getErrorMessage(data.response.status)}
          </div>
        </div>
      )
      : ''}
  </div>
);

SplitNotificationBar.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]),
  onDismissSplitNotification: PropTypes.func.isRequired,
};

export default SplitNotificationBar;
