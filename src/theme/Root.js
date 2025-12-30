import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import StructuredData from '@site/src/components/StructuredData';

// Default implementation, that you can customize
export default function Root({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    // Add class to body when on index page to hide sidebar
    const isIndexPage = location.pathname === '/' || 
                       location.pathname === '/de/' || 
                       location.pathname === '/nl/';
    
    if (isIndexPage) {
      document.body.classList.add('page-index');
    } else {
      document.body.classList.remove('page-index');
    }
  }, [location.pathname]);
  
  return (
    <>
      <StructuredData />
      {children}
    </>
  );
}

