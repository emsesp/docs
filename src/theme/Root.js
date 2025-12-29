import React from 'react';
import StructuredData from '@site/src/components/StructuredData';

// Default implementation, that you can customize
export default function Root({ children }) {
  return (
    <>
      <StructuredData />
      {children}
    </>
  );
}

