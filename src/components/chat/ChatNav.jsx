import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneConversation } from '../../redux/actions.js';

/**
 * ChatNav component
 * Displays the list of conversations
 * Handles the selection of a conversation
 * Fetches the selected conversation
 * @returns {JSX.Element}
 * @constructor
 */
const ChatNav = () => {
  const { currentConversation, conversationArray } = useSelector(
    (state) => state.conversations,
  );
  const dispatch = useDispatch();
  const handleSelectConversation = (conId) => {
    dispatch(fetchOneConversation(conId));
  };

  return (
    <Grid
      item
      xs={3}
      pt={1}
      borderRight="1px solid rgba(0, 0, 0, 0.12)"
      maxHeight="100%"
      minHeight="100%"
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="left">
        Messages
      </Typography>
      <List
        sx={{
          overflow: 'auto',
          maxHeight: `calc(100% - 60px)`,
          pr: 4,
          alignItems: 'start',
        }}
      >
        {conversationArray.map((con, index) => (
          <ListItem
            button
            key={index}
            sx={{
              p: 0,
              borderRadius: 3,
              px: 2,
              backgroundColor: currentConversation
                ? currentConversation.id !== con.id
                  ? 'inherit'
                  : '#f5f5f5'
                : 'inherit',
            }}
            onClick={() => handleSelectConversation(con.id)}
          >
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary={con.participants[0].name}
              secondary={con.item.name}
            />
            <Typography variant="body2" color="text.secondary">
              {new Date(con.lastUpdated).toLocaleTimeString()}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};

export default ChatNav;
