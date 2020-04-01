import React from 'react';
import PropTypes from 'prop-types';

import AutoSuggest from 'components/AutoSuggest';
import { wktPointToLocation } from 'shared/services/map-location';

const serviceParams = [
  ['fq', 'bron:BAG'],
  ['fq', 'type:adres'],
  // ['fl', '*'], // undocumented; requests all available field values from the API
  ['fl', 'id, weergavenaam, centroide_ll'],
  ['q', ''],
];
const serviceURL = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?';
const numOptionsDeterminer = data => data?.response?.docs?.length || 0;
const formatResponse = ({ response }) => response.docs.map(({ id, weergavenaam, centroide_ll }) => ({ id, value: weergavenaam, location:  wktPointToLocation(centroide_ll) }));

/**
 * Geocoder component that specifically uses the PDOK location service to request information from
 *
 * @see {@link https://www.pdok.nl/restful-api/-/article/pdok-locatieserver#/paths/~1suggest/get}
 */
const PDOKAutoSuggest = ({ gemeentenaam, onSelect, value, ...otherProps }) => {
  const fq = gemeentenaam && [['fq', `gemeentenaam:${gemeentenaam}`]];
  const params = fq.concat(serviceParams).filter(Boolean);
  const queryParams = params.flatMap(([key, val]) => `${key}=${val}`).join('&');
  const URL = `${serviceURL}`.concat(queryParams);

  return (
    <AutoSuggest
      url={URL}
      numOptionsDeterminer={numOptionsDeterminer}
      formatResponse={formatResponse}
      onSelect={onSelect}
      value={value}
      {...otherProps}
    />
  );
};

PDOKAutoSuggest.defaultProps = {
  gemeentenaam: 'amsterdam',
  value: '',
};

PDOKAutoSuggest.propTypes = {
  /**
   * Value that determines to which municipality the search query should be applied
   * Can be a single name, like amsterdam, or a combination, like (amsterdam OR weesp)
   */
  gemeentenaam: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default PDOKAutoSuggest;
