import React from 'react';
import PropTypes from 'prop-types';

import AutoSuggest from 'components/AutoSuggest';
import { pdokResponseFieldList } from 'shared/services/map-location';

const serviceParams = [
  ['fq', 'bron:BAG'],
  ['fq', 'type:adres'],
  // ['fl', '*'], // undocumented; requests all available field values from the API
  ['fl', pdokResponseFieldList.join(',')],
  ['q', ''],
];
const serviceURL = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?';
const numOptionsDeterminer = data => data?.response?.docs?.length || 0;
export const formatResponseFunc = ({ response }) => response.docs.map(({ id, weergavenaam }) => ({ id, value: weergavenaam }));

/**
 * Geocoder component that specifically uses the PDOK location service to request information from
 *
 * @see {@link https://www.pdok.nl/restful-api/-/article/pdok-locatieserver#/paths/~1suggest/get}
 */
const PDOKAutoSuggest = ({ className, fieldList, gemeentenaam, onSelect, formatResponse, value, ...rest }) => {
  const fq = gemeentenaam && [['fq', `gemeentenaam:${gemeentenaam}`]];
  const fl = [['fl', fieldList.concat(['id', 'weergavenaam']).join(',')]];
  const params = fq
    .concat(fl)
    .concat(serviceParams)
    .filter(Boolean);
  const queryParams = params.flatMap(([key, val]) => `${key}=${val}`).join('&');
  const URL = `${serviceURL}`.concat(queryParams);

  return (
    <AutoSuggest
      className={className}
      url={URL}
      numOptionsDeterminer={numOptionsDeterminer}
      formatResponse={formatResponse}
      onSelect={onSelect}
      value={value}
      {...rest}
    />
  );
};

PDOKAutoSuggest.defaultProps = {
  className: '',
  fieldList: [],
  gemeentenaam: 'amsterdam',
  formatResponse: formatResponseFunc,
  value: '',
};

PDOKAutoSuggest.propTypes = {
  className: PropTypes.string,
  fieldList: PropTypes.arrayOf(PropTypes.string),
  /**
   * Value that determines to which municipality the search query should be applied
   * Can be a single name, like amsterdam, or a combination, like (amsterdam OR weesp)
   */
  gemeentenaam: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  formatResponse: PropTypes.func,
  value: PropTypes.string,
};

export default PDOKAutoSuggest;
