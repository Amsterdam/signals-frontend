import { get } from 'lodash';

function mapDynamicFields(text, fields) {
  return text.replace(/{.+?}/g, (match) => {
    const key = match.replace(/[{}]/g, '');
    return get(fields, key);
  });
}

export default mapDynamicFields;
