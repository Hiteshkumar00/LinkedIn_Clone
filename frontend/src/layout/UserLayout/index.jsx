import React from 'react';

import Navbar from '@/Components/Navbar';

function UserLayout({ children }) {
  return (
    <div style={{height: "100vh"}} >
      <Navbar />
      { children }
    </div>
  )
};


export default UserLayout;