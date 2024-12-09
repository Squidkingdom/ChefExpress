import React from 'react';
import OrderPage from './OrderPage';

const Order = () => {
  console.log('Rendering Order component'); // Debug log
  
  return (
    <React.StrictMode>
      <OrderPage />
    </React.StrictMode>
  );
};

export default Order;