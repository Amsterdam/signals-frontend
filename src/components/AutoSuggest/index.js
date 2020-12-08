import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import useDebounce from 'hooks/useDebounce';
import useFetch from 'hooks/useFetch';
import Input from 'components/Input';
import SuggestList from './components/SuggestList';

export const INPUT_DELAY = 350;

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const StyledInput = styled(Input)`
  outline: 2px solid rgb(0, 0, 0, 0.1);

  & > * {
    margin: 0;
  }
`;

const AbsoluteList = styled(SuggestList)`
  position: absolute;
  width: 100%;
  background-color: white;
`;

/**
 * Autosuggest component that renders a text box and a list with suggestions after text input
 *
 * The text input is delayed by 350ms to prevent flooding of the REST service. Both rendered elements are fully
 * accessibly and have corresponding ARIA 1.1 rules according to spec.
 *
 * Keyboard navigation is handled in the component where (when the list is open):
 * - Tab focuses or blurs the text box, but not the list options
 * - Up and down keys cycle through the list of options, keeping focus on the input field
 * - Escape closes the list, focuses and clears the input field
 * - Home key focuses the input field at the first character
 * - End key focuses the input field at the last character
 */
const AutoSuggest = ({
  className,
  formatResponse,
  numOptionsDeterminer,
  onClear,
  onSelect,
  placeholder,
  url,
  value,
}) => {
  const { get, data } = useFetch();
  const [initialRender, setInitialRender] = useState(false);
  const [showList, setShowList] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const options = data && formatResponse(data);
  const activeId = options && options[activeIndex]?.id;

  const handleInputKeyDown = useCallback(event => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        break;

      default:
        break;
    }
  }, []);

  const handleKeyDown = useCallback(
    event => {
      if (!showList) return;

      const numberOfOptions = numOptionsDeterminer(data);

      switch (event.key) {
        case 'Up':
        case 'ArrowUp':
          event.preventDefault();

          setActiveIndex(state => {
            const indexOfActive = state - 1;
            const topReached = indexOfActive < 0;

            return topReached ? numberOfOptions - 1 : indexOfActive;
          });

          break;

        case 'Down':
        case 'ArrowDown':
          event.preventDefault();

          setActiveIndex(state => {
            const indexOfActive = state + 1;
            const endReached = indexOfActive === numberOfOptions;

            return endReached ? 0 : indexOfActive;
          });

          break;

        case 'Esc':
        case 'Escape':
          inputRef.current.value = '';
          setActiveIndex(-1);
          setShowList(false);
          onClear();
          break;

        case 'Home':
          event.preventDefault();

          inputRef.current.focus();
          inputRef.current.setSelectionRange(0, 0);
          setActiveIndex(-1);
          break;

        case 'End':
          event.preventDefault();

          inputRef.current.focus();
          inputRef.current.setSelectionRange(9999, 9999);
          setActiveIndex(-1);
          break;

        default:
          setActiveIndex(-1);
          break;
      }
    },
    [data, numOptionsDeterminer, showList, onClear]
  );

  useEffect(() => {
    setInitialRender(true);
  }, []);

  /**
   * Subscribe to activeIndex changes which happen after keyboard input
   */
  useEffect(() => {
    if (!initialRender) return;

    if (activeIndex === -1) {
      inputRef.current.focus();
    }
    // only respond to changed in activeIndex; disabling linter
    // eslint-disable-next-line
  }, [activeIndex]);

  /**
   * Register and unregister listeners
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const input = inputRef.current;

    wrapper.addEventListener('keydown', handleKeyDown);
    input.addEventListener('focusout', handleFocusOut);
    input.addEventListener('keydown', handleInputKeyDown);

    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown);
      input.removeEventListener('focusout', handleFocusOut);
      input.removeEventListener('keydown', handleInputKeyDown);
    };
  }, [handleKeyDown, handleFocusOut, handleInputKeyDown]);

  /**
   * Subscribe to changes in fetched data
   */
  useEffect(() => {
    const hasResults = numOptionsDeterminer(data) > 0;

    setShowList(hasResults);
  }, [data, numOptionsDeterminer]);

  const handleFocusOut = useCallback(event => {
    if (wrapperRef.current.contains(event.relatedTarget)) return;

    setActiveIndex(-1);
    setShowList(false);
  }, []);

  const serviceRequest = useCallback(
    inputValue => {
      if (inputValue.length >= 3) {
        get(`${url}${encodeURIComponent(inputValue)}`);
      } else {
        setShowList(false);

        if (inputValue.length === 0) {
          onClear();
        }
      }
    },
    [get, onClear, url]
  );

  const debouncedServiceRequest = useDebounce(serviceRequest, INPUT_DELAY);

  const onChange = useCallback(
    event => {
      event.persist();
      debouncedServiceRequest(event.target.value);
    },
    [debouncedServiceRequest]
  );

  const onSelectOption = useCallback(
    option => {
      setActiveIndex(-1);
      setShowList(false);

      inputRef.current.value = option.value;
      onSelect(option);
    },
    [onSelect]
  );

  useEffect(() => {
    inputRef.current.value = value;
  }, [value]);

  return (
    <Wrapper className={className} ref={wrapperRef} data-testid="autoSuggest">
      <div role="combobox" aria-controls="as-listbox" aria-expanded={showList} aria-haspopup="listbox">
        <StyledInput
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          defaultValue={value}
          onChange={onChange}
          placeholder={placeholder}
          ref={inputRef}
        />
      </div>
      {showList && (
        <AbsoluteList
          activeIndex={activeIndex}
          id="as-listbox"
          onSelectOption={onSelectOption}
          options={options}
          role="listbox"
        />
      )}
    </Wrapper>
  );
};

AutoSuggest.defaultProps = {
  className: '',
  placeholder: '',
  value: '',
};

AutoSuggest.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /**
   * Request response formatter
   *
   * @param {Any} data - Autosuggest Request response containing the list of options
   * @returns {Object[]} Array of objects where each object is required to have an `id` prop and a `value` prop
   */
  formatResponse: PropTypes.func.isRequired,
  /**
   * Result count getter
   *
   * @param {Any} data - Request response containing the list options
   * @return {Number} The amount of options returned from the request
   */
  numOptionsDeterminer: PropTypes.func.isRequired,
  /** Callback function that is called whenever the input field */
  onClear: PropTypes.func,
  /**
   * Option select callback
   * @param {Object} option - The selected option
   * @param {String} option.id - Unique option identifier
   * @param {String} option.value - Option text label
   */
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  /**
   * Request URL from which options should be gotten and to which the search query should be appended
   * @example `//some-domain.com/api-endpoint?q=`
   */
  url: PropTypes.string.isRequired,
  /** defaultValue for the input field */
  value: PropTypes.string,
};

export default AutoSuggest;
