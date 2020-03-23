import React, { Fragment, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, themeSpacing, Icon } from '@datapunt/asc-ui';
import { ChevronRight } from '@datapunt/asc-assets';

const StyledList = styled.ul`
  border: 1px solid ${themeColor('tint', 'level5')};
  border-top: 0;
  padding: 0;
  margin: 0;
`;

const Li = styled.li`
  line-height: 20px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;

  &:hover {
    background-color: ${themeColor('tint', 'level2')};
  }
`;

const Chevron = styled(ChevronRight)`
  display: inline-block;
`;

const StyledIcon = styled(Icon)`
  margin: 0 ${themeSpacing(2)} 0 0;
  display: inline-block;
`;

const SuggestList = ({ activeIndex, className, role, options, onSelectOption, ...rest }) => {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;

    if (activeIndex >= 0 && activeIndex < options.length) {
      list.children[activeIndex].focus();
    }
  }, [activeIndex, options.length]);

  const onSelect = useCallback(
    option => {
      onSelectOption(option);
    },
    [onSelectOption]
  );

  return (
    <StyledList className={className} role={role} ref={listRef} {...rest}>
      {options.map(option => (
        <Li
          id={option.id}
          data-id={option.id}
          key={option.id}
          onClick={() => onSelect(option)}
          onKeyDown={event => event.keyCode === 13 && onSelect(option)}
          role="option"
          tabIndex={-1}
        >
          <Fragment>
            <StyledIcon size={12}>
              <Chevron />
            </StyledIcon>
            {option.value}
          </Fragment>
        </Li>
      ))}
    </StyledList>
  );
};

SuggestList.defaultProps = {
  activeIndex: 0,
  className: '',
  role: 'listbox',
};

SuggestList.propTypes = {
  activeIndex: PropTypes.number,
  className: PropTypes.string,
  onSelectOption: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** aria-role for the listbox element */
  role: PropTypes.string,
};

export default SuggestList;
