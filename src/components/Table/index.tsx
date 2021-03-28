import React from 'react';
import styled from 'styled-components';

const StyledTable = styled.table`
  border: 1px solid #000;
  border-collapse: collapse;
`;

const Table: React.FunctionComponent = ({ children }) => {
  return (
    <StyledTable>
      { children }
    </StyledTable>
  )
}

export default Table;

