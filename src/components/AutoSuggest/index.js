import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import useFetch from 'hooks/useFetch';
import Input from 'components/Input';
import SuggestList from './SuggestList';

const formatFunc = ({ response }) => response.docs.map(({ id, weergavenaam }) => ({ id, value: weergavenaam }));
const numOptionsFunc = data => data?.response?.docs?.length || 0;
const INPUT_DELAY = 350;

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

// https://www.pdok.nl/restful-api/-/article/pdok-locatieserver#/paths/~1suggest/get
const serviceParams = [
  ['fq', 'bron:BAG'],
  ['fq', 'type:adres'],
  // ['fq', 'gemeentenaam:(amsterdam OR weesp)'],
  ['fq', 'gemeentenaam:amsterdam'],
  ['q', ''],
];
const asService = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?';
const URL = `${asService}`.concat(serviceParams.flatMap(([key, value]) => `${key}=${value}`).join('&'));

/**
 * Autosuggest component that renders a text box and a list with suggestions after text input
 *
 * The text input is delayed by 350ms to prevent flooding of the REST service. Both rendered elements and fully
 * accessibly and have corresponding ARIA 1.1 rules according to spec.
 *
 * Keyboard navigation is handled in the component where:
 * - Tab focuses or blurs the text box, but not the list options
 * - Up and down keys cycle through the list of options, keeping focus on the input field
 * - Escape closes the list, focuses and clears the input field
 * - Home key focuses the input field at the first character (when the list is open)
 * - End key focuses the input field at the last character (when the list is open)
 */
const AutoSuggest = ({
  className,
  formatResponse = formatFunc,
  numOptionsDeterminer = numOptionsFunc,
  onSelect,
  url = URL,
}) => {
  const { get, data } = useFetch();
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const handleKeyDown = useCallback(
    event => {
      const numberOfOptions = numOptionsDeterminer(data);
      if (!show) return;

      switch (event.keyCode) {
        // Arrow up
        case 38:
          event.preventDefault();

          setActiveIndex(state => {
            const indexOfActive = state - 1;
            const topReached = indexOfActive === -1;

            return topReached ? numberOfOptions - 1 : indexOfActive;
          });
          break;

        // Arrow down
        case 40:
          event.preventDefault();

          setActiveIndex(state => {
            const indexOfActive = state + 1;
            const endReached = indexOfActive === numberOfOptions;

            return endReached ? 0 : indexOfActive;
          });
          break;

        // Enter
        case 13:
          if (event.target !== inputRef.current) {
            inputRef.current.value = event.target.innerText;
          }

          setActiveIndex(-1);
          setShow(false);
          break;

        // Escape
        case 27:
          inputRef.current.value = '';
          setActiveIndex(-1);
          setShow(false);
          break;

        // Home
        // Moves focus to the textbox and places the editing cursor at the beginning of the field.
        case 36:
          event.preventDefault();

          inputRef.current.focus();
          inputRef.current.setSelectionRange(0, 0);
          break;

        // End
        // Moves focus to the textbox and places the editing cursor at the end of the field.
        case 35:
          event.preventDefault();

          inputRef.current.focus();
          inputRef.current.setSelectionRange(9999, 9999);
          break;

        default:
          setActiveIndex(-1);
          break;
      }
    },
    [data, numOptionsDeterminer, show]
  );

  useEffect(() => {
    if (activeIndex === -1) {
      inputRef.current.focus();
    }
  }, [activeIndex]);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    wrapper.addEventListener('keydown', handleKeyDown);

    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const hasResults = numOptionsDeterminer(data) > 0;

    setShow(hasResults);
  }, [data, numOptionsDeterminer]);

  const delayedCallback = useCallback(
    debounce(value => {
      serviceRequest(value);
    }, INPUT_DELAY),
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
        get(`${url}${value}`);
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
    <Wrapper className={className} ref={wrapperRef}>
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
   * @param {Any} data - Autosuggest Request response containing the list options
   * @returns {Object[]} Array of objects where each object is required to have an `id` prop and a `value` prop
   */
  formatResponse: PropTypes.func,
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
