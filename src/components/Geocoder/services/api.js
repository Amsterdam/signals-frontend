import { wktPointToPointFeature } from './transformers';
import { getLocation } from '../../../shared/services/map-location';

const GEOCODER_API_SUGGEST =
  'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=gemeentenaam:(amsterdam OR weesp)&fq=type:adres&q=';
const GEOCODER_API_LOOKUP =
  'https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?fq=gemeentenaam:(amsterdam OR weesp)&fq=type:adres&id=';

export const getSuggestions = async searchTerm => {
  const result = await window.fetch(`${GEOCODER_API_SUGGEST}${searchTerm}`);
  const data = await result.json();
  const suggestions = data.response.docs.map(item => ({
    id: item.id,
    name: item.weergavenaam,
  }));
  return suggestions;
};

export const getAddressById = async addressId => {
  const result = await window.fetch(`${GEOCODER_API_LOOKUP}${addressId}`);
  const { response } = await result.json();
  if (response.docs[0]) {
    const { centroide_ll } = response.docs[0];
    return {
      location: wktPointToPointFeature(centroide_ll),
      address: { ...getLocation(response.docs[0]) },
    };
  }
  return null;
};
