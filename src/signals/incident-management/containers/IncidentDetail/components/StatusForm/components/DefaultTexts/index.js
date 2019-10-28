/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, Heading } from '@datapunt/asc-ui';

import { defaultTextsType } from 'shared/types';

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-top: 20px;
  margin-bottom: 8px;
`;

const StyledDefaultText = styled.div`
  background-color: #e3e3e3;
  padding: 10px;
  margin-bottom: 10px;
`;

const StyledTitle = styled.div`
  font-family: "Avenir Next LT W01 Demi";
  margin-bottom: 5px;
`;

const StyledLink = styled(Link)`
  font-size: 16px;
  margin-top: 10px;
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
            <StyledH4 $as="h4" data-testid="defaultTextsTitle">Standaard teksten</StyledH4>

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
