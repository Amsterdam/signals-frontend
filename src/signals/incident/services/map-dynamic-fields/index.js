import get from 'lodash.get';

function mapDynamicFields(text, fields) {
  return text.replace(/{.+?}/g, (match) => {
    const key = match.replace(/[{}]/g, '');
    return get(fields, key) || `[${key}]`;
  });
}

export default mapDynamicFields;
