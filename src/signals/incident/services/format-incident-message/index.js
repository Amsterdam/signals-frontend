import flattenObject from '../object-flatten';

/**
 * Either formats message through i18n intl context or simply passes back string value
 * @param intl
 * @param value
 * @param incident
 * @returns {*}
 */
const formatIncidentMessage = (intl, value, incident) => {
  if (typeof value === 'object') {
    const descriptor = value;
    const shallowValues = flattenObject(incident, '', ':');
    return intl.formatMessage(descriptor, shallowValues);
  } else if (typeof value === 'string') {
    return value;
  }
  throw new Error(`invalid message value: ${value}; ${typeof value}`);
};

export default formatIncidentMessage;
