/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, Heading, themeColor, themeSpacing  } from '@datapunt/asc-ui';

import { defaultTextsType } from 'shared/types';

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(2)};
  margin-top: ${themeSpacing(5)};
`;

const StyledDefaultText = styled.div`
  background-color: ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(1)};
`;

const StyledTitle = styled.div`
  font-family: "Avenir Next LT W01 Demi";
  margin-bottom: ${themeSpacing(2)};
`;

const StyledLink = styled(Link)`
  font-size: ${themeSpacing(4)};
  margin-top: ${themeSpacing(2)};
  text-decoration: underline;
  display: inline-block;
  cursor: pointer;
`;

const DefaultTexts = ({ defaultTexts, status, hasDefaultTexts, onHandleUseDefaultText }) => {
  const allText = (defaultTexts && defaultTexts.length && defaultTexts.find(text => text.state === status));

  return (
    <div>
      {hasDefaultTexts && allText
        ? (
          <Fragment>
            <StyledH4 forwardedAs="h4" data-testid="defaultTextsTitle">Standaard teksten</StyledH4>

            {allText.templates.map((item, index) => (
              <StyledDefaultText key={index}>
                <StyledTitle
                  data-testid="defaultTextsItemTitle"
                >{item.title}</StyledTitle>
                <div
                  data-testid="defaultTextsItemText"
                >{item.text}</div>
                <StyledLink
                  data-testid="defaultTextsItemButton"
                  variant="inline"
                  onClick={e => onHandleUseDefaultText(e, item.text)}
                >
                  Gebruik deze tekst
                </StyledLink>
              </StyledDefaultText>
            ))}
          </Fragment>
        )
        : ''}
    </div>
  );
};

DefaultTexts.propTypes = {
  defaultTexts: defaultTextsType.isRequired,
  status: PropTypes.string.isRequired,
  hasDefaultTexts: PropTypes.bool.isRequired,

  onHandleUseDefaultText: PropTypes.func.isRequired,
};

export default DefaultTexts;
