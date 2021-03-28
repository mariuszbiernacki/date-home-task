import React from 'react';

const TableHeader: React.FunctionComponent = ({ children }) => {
  return (
    <thead>
      { children }
    </thead>
  )
}

export default TableHeader;