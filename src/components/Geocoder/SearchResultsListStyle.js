import styled from "@datapunt/asc-core";

const SearchResultsListStyle = styled.div`
  background-color: #fff;
  border: 1px solid grey;
  width: calc(100% - 45px);
  box-shadow: 2px 2px 0 0 #999;
  margin-top: -2px;

  & > ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
      font-size: 0;

      display: inline-block;

      font-size: 16px;
      text-decoration: none;
      text-overflow: ellipsis;
      padding: 0 6px 0 7px;
      width: 100%;
      height: 32px;
      line-height: 32px;
      overflow: hidden;
      white-space: nowrap;
    }
  }
`;

export default SearchResultsListStyle;
