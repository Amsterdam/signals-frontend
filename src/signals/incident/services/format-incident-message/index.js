import flattenObject from '../object-flatten';

/**
 * Either formats message through i18n intl context or simply passes back string value
 * @param intl
 * @param value either string label or a message descriptor object
 * @param incident
 * @returns string
 */
const formatIncidentMessage = (intl, value, incident) => {
  if (value !== null && typeof value === 'object' && value.id && value.defaultMessage) {
    const descriptor = value;
    const shallowValues = flattenObject(incident, '', ':');
    return intl.formatMessage(descriptor, shallowValues);
  } else if (typeof value === 'string') {
    return value;
  }
  throw new Error(`invalid message value: ${value}; ${typeof value}`);
};

export default formatIncidentMessage;
