const GEOCODER_API_SUGGEST =
  'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=gemeentenaam:(amsterdam OR weesp)&fq=type:adres&q=';

const getSuggestions = async searchTerm => {
  const result = await window.fetch(`${GEOCODER_API_SUGGEST}${searchTerm}`);
  const data = await result.json();
  const suggestions = data.response.docs.map(item => ({
    id: item.id,
    name: item.weergavenaam,
  }));
  return suggestions;
};

export default getSuggestions;
