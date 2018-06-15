/*
 *
 * LanguageToggle
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { changeLocale } from '../LanguageProvider/actions';
import { makeSelectLocale } from '../LanguageProvider/selectors';

export class LocaleToggle extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // TODO: the switching between locale and the displaylocalename can be prettier
  onToggle(locale) {
    let switchTo;
    switch (locale) {
      case 'en':
        switchTo = 'nl';
        break;
      case 'nl':
        switchTo = 'en';
        break;
      default:
        switchTo = 'nl';
    }
    this.props.onLocaleToggle(switchTo);
  }

  getSwitchToLocaleName(locale) {
    switch (locale) {
      case 'en':
        return 'Nederlands';
      case 'nl':
        return 'English';
      default:
        return '';
    }
  }

  /* eslint-disable jsx-a11y/href-no-hash */
  render() {
    return (
      <a href="#" onClick={() => this.onToggle(this.props.locale)}>
        <span className="linklabel">
          {this.getSwitchToLocaleName(this.props.locale)}
        </span>
      </a>
    );
  }
  /* eslint-enable */
}

LocaleToggle.propTypes = {
  onLocaleToggle: PropTypes.func,
  locale: PropTypes.string,
};

const mapStateToProps = createSelector(
  makeSelectLocale(),
  (locale) => ({ locale })
);

export function mapDispatchToProps(dispatch) {
  return {
    onLocaleToggle: (locale) => dispatch(changeLocale(locale))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocaleToggle);
