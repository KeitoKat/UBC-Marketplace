import { Box, Grid } from '@mui/material';
import ChatNav from './ChatNav.jsx';
import ChatContent from './ChatContent.jsx';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchConversations } from '../../redux/actions.js';

/**
 * Chat component
 * Contains ChatNav and ChatContent components
 * @returns {JSX.Element}
 */
const Chat = () => {
  const loggedInUserId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  useEffect(() => {
    if (loggedInUserId) dispatch(fetchConversations(loggedInUserId));
  }, [dispatch, loggedInUserId]);
  return (
    <Box sx={{ flexGrow: 1, height: `calc(100vh - 270px)` }}>
      <Grid container sx={{ height: '100%' }}>
        <ChatNav />
        <ChatContent />
      </Grid>
    </Box>
  );
};

export default Chat;
