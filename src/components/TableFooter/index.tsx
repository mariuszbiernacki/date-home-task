import React from 'react';

const TableFooter: React.FunctionComponent = ({ children }) => {
  return (
    <tfoot>
      { children }
    </tfoot>
  )
}

export default TableFooter;

