/* eslint-disable react/prop-types */
import React, {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { SearchBar } from '@datapunt/asc-ui';
import SearchResultsList from './SearchResultsList';
import {
  searchTermSelected,
  clearSearchResults,
  searchResultsChanged,
  resultSelected,
  searchTermChanged,
} from './ducks';

import { useGeocoderContext } from './GeocoderContext';

const inputProps = {
  autoCapitalize: 'off',
  autoComplete: 'off',
  autoCorrect: 'off',
};

const GeocoderBar = ({
  placeholder,
  getSuggestions,
  getAddressById,
}) => {
  const { state, dispatch, onLocationChange, location } = useGeocoderContext();
  const { term, searchMode, index, results } = state;
  console.log(location);
  const onSelect = async idx => {
    dispatch(searchTermSelected(results[idx].name));
    const { id } = results[idx];
    const newLocation = await getAddressById(id);
    console.log('on select', newLocation);
    onLocationChange(newLocation);
    dispatch(clearSearchResults());
  };

  useEffect(() => {
    if (!searchMode) return;
    if (index > -1) return;
    if (term.length < 3) {
      dispatch(clearSearchResults());
    } else {
      (async () => {
        const suggestions = await getSuggestions(term);
        dispatch(searchResultsChanged(suggestions));
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const handleKeyDown = async event => {
    switch (event.keyCode) {
      // Arrow up
      case 38:
        // By default the up arrow puts the cursor at the
        // beginning of the input, we don't want that!
        event.preventDefault();

        dispatch(resultSelected(index > -1 ? index - 1 : index));
        break;

      // Arrow down
      case 40:
        dispatch(
          resultSelected(index < results.length - 1 ? index + 1 : index)
        );
        break;

      // Escape
      case 27:
        dispatch(searchTermChanged(''));
        dispatch(clearSearchResults());
        break;

      // Enter
      case 13:
        event.preventDefault();
        if (index > -1) {
          await onSelect(index);
        }
        break;

      default:
        break;
    }
  };

  const handleOnSubmit = async () => {
    if (results.length === 0) return;
    const idx = index === -1 ? 0 : index;
    onSelect(idx);
  };

  const handleOnChange = value => {
    dispatch(searchTermChanged(value));
  };

  return (
    <React.Fragment>
      <SearchBar
        placeholder={placeholder}
        inputProps={inputProps}
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        value={term}
      />
      <SearchResultsList items={results} selected={index} onSelect={onSelect} />
    </React.Fragment>
  );
};

GeocoderBar.defaultProps = {
  placeholder: 'Zoek adres',
};

GeocoderBar.propTypes = {
  placeholder: PropTypes.string,
  getSuggestions: PropTypes.func.isRequired,
  getAddressById: PropTypes.func.isRequired,
};

export default GeocoderBar;
