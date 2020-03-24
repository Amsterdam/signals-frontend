import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import useFetch from 'hooks/useFetch';
import Input from 'components/Input';
import SuggestList from './components/SuggestList';

export const INPUT_DELAY = 350;

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  min-width: 350px;
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
const AutoSuggest = ({ className, formatResponse, numOptionsDeterminer, onSelect, url }) => {
  const { get, data } = useFetch();
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const handleKeyDown = useCallback(
    event => {
      if (!show) return;

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

        case 'Enter':
          if (event.target === inputRef.current) {
            return;
          }

          inputRef.current.value = event.target.innerText;

          setActiveIndex(-1);
          setShow(false);
          break;

        case 'Esc':
        case 'Escape':
          inputRef.current.value = '';
          setActiveIndex(-1);
          setShow(false);
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
    [data, numOptionsDeterminer, show]
  );

  const handleFocusOut = useCallback(
    event => {
      if (!wrapperRef.current.contains(event.relatedTarget)) {
        setActiveIndex(-1);
        setShow(false);
      }
    },
    []
  );

  /**
   * Subscribe to activeIndex changes which happen after keyboard input
   */
  useEffect(() => {
    if (activeIndex === -1) {
      inputRef.current.focus();
    }
  }, [activeIndex]);

  /**
   * Register and unregister listeners
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const input = inputRef.current;

    wrapper.addEventListener('keydown', handleKeyDown);
    input.addEventListener('focusout', handleFocusOut);

    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown);
      input.removeEventListener('focusout', handleFocusOut);
    };
  }, [handleKeyDown, handleFocusOut]);

  /**
   * Subscribe to changes in fetched data
   */
  useEffect(() => {
    const hasResults = numOptionsDeterminer(data) > 0;

    setShow(hasResults);
  }, [data, numOptionsDeterminer]);

  const delayedCallback = useCallback(
    debounce(value => serviceRequest(value), INPUT_DELAY),
    [serviceRequest]
  );

  const onChange = useCallback(
    event => {
      event.persist();
      const { value } = event.target;
      delayedCallback(value);
    },
    [delayedCallback]
  );

  const serviceRequest = useCallback(
    value => {
      if (value.length >= 3) {
        get(`${url}${encodeURIComponent(value)}`);
      } else {
        setShow(false);
      }
    },
    [get, url]
  );

  const onSelectOption = useCallback(
    option => {
      setActiveIndex(-1);
      setShow(false);

      inputRef.current.value = option.value;
      onSelect(option);
    },
    [onSelect]
  );

  const options = data && formatResponse(data);
  const activeId = options && options[activeIndex]?.id;

  return (
    <Wrapper className={className} ref={wrapperRef} data-testid="autoSuggest">
      <div role="combobox" aria-controls="as-listbox" aria-expanded={show} aria-haspopup="listbox">
        <Input onChange={onChange} aria-activedescendant={activeId} aria-autocomplete="list" ref={inputRef} />
      </div>
      {show && (
        <AbsoluteList
          options={options}
          role="listbox"
          id="as-listbox"
          onSelectOption={onSelectOption}
          activeIndex={activeIndex}
        />
      )}
    </Wrapper>
  );
};

AutoSuggest.defaultProps = {
  className: '',
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
  /**
   * Option select callback
   * @param {Object} option - The selected option
   * @param {String} option.id - Unique option identifier
   * @param {String} option.value - Option text label
   */
  onSelect: PropTypes.func.isRequired,
  /**
   * Request URL from which options should be gotten and to which the search query should be appended
   * @example `//some-domain.com/api-endpoint?q=`
   */
  url: PropTypes.string.isRequired,
};

export default AutoSuggest;
