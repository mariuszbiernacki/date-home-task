import React from 'react';
import styled from 'styled-components';
import { TableCellProps } from './interfaces';

const StyledTd = styled.td`
  border: 1px solid #000;
  text-align: center;
  padding: .75rem;
`;

const StyledTh = styled.th`
  border: 1px solid #000;
  font-weight: bold;
  padding: .75rem;
  text-align: center;
`;

const TableCell: React.FunctionComponent<TableCellProps> = (props: any) => {
  const { children, header, ...attributes } = props;
  const Tag = header ? StyledTh : StyledTd;

  return (
    <Tag
      { ...attributes }
    >
      { children }
    </Tag>
  )
}

export default TableCell;