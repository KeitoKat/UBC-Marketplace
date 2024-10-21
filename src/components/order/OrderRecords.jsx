import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import {
  fetchOrdersByBuyer,
  fetchOrdersBySeller,
} from '../../redux/order/orderActions.js';
import OrderList from './OrderList.jsx';

/**
 * OrderRecords component to display buyer and seller orders
 * Handles tab change and fetches orders by
 * @param userId
 * @returns {JSX.Element}
 */
const OrderRecords = ({ userId }) => {
  const dispatch = useDispatch();
  const buyerOrders = useSelector((state) => state.orders.buyerOrders);
  const sellerOrders = useSelector((state) => state.orders.sellerOrders);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersByBuyer(userId));
      dispatch(fetchOrdersBySeller(userId));
    }
  }, [dispatch, userId]);

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="order records tabs"
        >
          <Tab label="Buyer Orders" />
          <Tab label="Seller Orders" />
        </Tabs>
      </Box>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography>Error: {error}</Typography>}
      {!loading && !error && (
        <>
          <TabPanel value={value} index={0}>
            <OrderList orders={buyerOrders} userType={'buyer'} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <OrderList orders={sellerOrders} userType={'seller'} />
          </TabPanel>
        </>
      )}
    </Box>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default OrderRecords;
