import React from 'react';

const container = ({children}) => {
  return (
    <div className='container mx-auto'>
      {children}
    </div>
  );
};

export default container;