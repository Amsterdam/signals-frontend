import React from 'react';
import PropTypes from 'prop-types';

import AutoSuggest from 'components/AutoSuggest';
import { pdokResponseFieldList } from 'shared/services/map-location';

const municipalityFilterName = 'gemeentenaam';
const serviceParams = [
  ['fq', 'bron:BAG'],
  ['fq', 'type:adres'],
  ['q', ''],
];
const serviceUrl = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?';
const numOptionsDeterminer = data => data?.response?.docs?.length || 0;
export const formatResponseFunc = ({ response }) =>
  response.docs.map(({ id, weergavenaam }) => ({ id, value: weergavenaam }));

/**
 * Geocoder component that specifically uses the PDOK location service to request information from
 *
 * @see {@link https://www.pdok.nl/restful-api/-/article/pdok-locatieserver#/paths/~1suggest/get}
 */

const PDOKAutoSuggest = ({ className, fieldList, municipality, onSelect, formatResponse, value, ...rest }) => {
  const municipalityArray = Array.isArray(municipality) ? municipality : [municipality].filter(Boolean);
  const municipalityString = municipalityArray.map(item => `${municipalityFilterName}:"${item}"`).join('');
  const fq = municipality ? [['fq', municipalityString]] : [];
  // ['fl', '*'], // undocumented; requests all available field values from the API
  const fl = [['fl', [...pdokResponseFieldList, ...fieldList].join(',')]];
  const params = [...fq, ...fl, ...serviceParams];
  const queryParams = params.map(([key, val]) => `${key}=${val}`).join('&');
  const url = `${serviceUrl}${queryParams}`;

  return (
    <AutoSuggest
      className={className}
      url={url}
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
  formatResponse: formatResponseFunc,
  value: '',
};

PDOKAutoSuggest.propTypes = {
  className: PropTypes.string,
  fieldList: PropTypes.arrayOf(PropTypes.string),
  /**
   * Value that determines to which municipality the search query should be
   * applied.
   *
   * Can be a single name, like amsterdam, or an array of one or more names.
   */
  municipality: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onSelect: PropTypes.func.isRequired,
  formatResponse: PropTypes.func,
  value: PropTypes.string,
};

export default PDOKAutoSuggest;
