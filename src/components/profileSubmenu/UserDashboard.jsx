import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

/**
 * UserDashboard component to display user dashboard
 * Including order history, track order, view invoice
 * @returns {JSX.Element}
 */
const UserDashboard = ({ onShowOrders }) => {
  return (
    <Box>
      <List>
        <ListItem button onClick={onShowOrders}>
          <ListItemIcon>
            <Avatar>
              <ShoppingCart />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary="Your order"
            secondary="Track an order or view invoice"
          />
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
};

export default UserDashboard;
