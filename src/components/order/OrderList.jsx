import { List, Typography } from '@mui/material';
import Order from './Order.jsx';

/**
 * OrderList component to display list of orders
 * @param orders
 * @param userType
 * @returns {JSX.Element}
 */
const OrderList = ({ orders, userType }) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return <Typography>No orders found</Typography>;
  }

  return (
    <List>
      {orders.map((order) => (
        <Order key={order.id} order={order} userType={userType} />
      ))}
    </List>
  );
};

export default OrderList;
