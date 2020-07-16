import styled from 'styled-components';
import { themeColor, themeSpacing, Icon } from '@datapunt/asc-ui';
import Button from 'components/Button';

const FileInputStyle = styled.div`
  display: flex;
  height: ${themeSpacing(25)};
`;

export const FileInputPreviewBox = styled.div`
  width: ${themeSpacing(25)};
  margin-right: ${themeSpacing(3)};
`;

export const FileInputEmptyBox = styled.div`
  width: ${themeSpacing(25)};
  border: 1px dashed ${themeColor('tint', 'level4')};
  margin-right: ${themeSpacing(3)};
`;

export const FileInputError = styled.div`
  color: ${themeColor('secondary')};
  margin: ${themeSpacing(4, 0, 0)};
`;

export const FileInputUploadButton = styled.div`
  width: ${themeSpacing(25)};
  border: 1px dashed ${themeColor('tint', 'level4')};
  margin-right: ${themeSpacing(3)};

  input[type='file'] {
    opacity: 0;
    width: 0;
    height: 0;
  }

  & > label {
    position: relative;
    display: inline-block;
    cursor: pointer;
    height: 100%;
    width: 100%;
  }
`;

export const DeleteButton = styled(Button)`
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);

  svg > path {
    fill: ${themeColor('tint', 'level1')};
  }

  &:hover {
    background-color: black;
  }
`;

export const AddButton = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${themeSpacing(11)};
  height: ${themeSpacing(11)};
  top: ${themeSpacing(7)};
  left: ${themeSpacing(7)};
  border-radius: 50%;
  border: 1px solid ${themeColor('primary')};

  &:hover {
    background-color: ${themeColor('tint', 'level1')};
    border-width: 2px;
    padding: 2px;
  }
`;

export const AddIcon = styled(Icon)`
  svg > path {
    fill: ${themeColor('primary')};
  }
`;

export const FilePreview = styled.div`
  position: relative;
  background-size: cover;
  height: 100%;
  width: 100%;
  background-image: ${({ preview }) => `URL(${preview})`};
`;

export const FileLoading = styled.div`
  position: relative;
  height: 100%;
  top: ${themeSpacing(9)};
  left: ${themeSpacing(5)};
`;

export default FileInputStyle;
