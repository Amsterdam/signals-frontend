import { get } from 'lodash';

function mapDynamicFields(text, fields) {
  return text.replace(/{.+?}/g, match => {
    const key = match.replace(/[{}]/g, '');
    return get(fields, key, `[niet gevonden: ${key}]`);
  });
}

export default mapDynamicFields;
