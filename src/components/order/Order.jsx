import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { updateOrderStatus } from '../../redux/order/orderActions.js';

/**
 * Order component to display order details and status update buttons
 * @param order
 * @param userType
 * @returns {JSX.Element}
 */
const Order = ({ order, userType }) => {
  const [status, setStatus] = useState(order.status);
  const [updatedAt, setUpdatedAt] = useState(order.updatedAt);
  const dispatch = useDispatch();

  const handleStatusChange = (newStatus) => {
    dispatch(updateOrderStatus({ orderId: order._id, newStatus }))
      .unwrap()
      .then((updatedOrder) => {
        setStatus(updatedOrder.status);
        setUpdatedAt(updatedOrder.updatedAt);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
      <Typography variant="h6">{order.itemName || 'N/A'}</Typography>
      <Typography>Order ID: {order._id}</Typography>
      <Typography>Status: {status}</Typography>
      <Typography>Seller: {order.seller?.name || 'N/A'}</Typography>
      <Typography>Buyer: {order.buyer?.name || 'N/A'}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2">
        Created: {new Date(order.createdAt).toLocaleString()}
      </Typography>
      <Typography variant="body2">
        Updated: {new Date(order.updatedAt).toLocaleString()}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between">
        <Button
          onClick={() => handleStatusChange('in delivery')}
          disabled={userType === 'buyer' || status !== 'pending'}
        >
          confirm
        </Button>
        <Button
          onClick={() => handleStatusChange('completed')}
          disabled={userType === 'seller' || status !== 'in delivery'}
        >
          complete
        </Button>
        <Button
          onClick={() => handleStatusChange('cancelled')}
          disabled={status === 'completed' || status === 'cancelled'}
        >
          cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default Order;
