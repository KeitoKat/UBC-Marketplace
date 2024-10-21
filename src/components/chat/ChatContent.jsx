import {
  AppBar,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMessage } from '../../redux/conversationReducer.js';
import { sendNewMessage } from '../../redux/actions.js';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos.js';
import axios from 'axios';
import { useRef } from 'react';

/**
 * MessageList component
 * Contains the list of messages in the conversation
 * Displays the messages in a chat bubble format
 * Order is based on the time the message was sent
 * @returns {JSX.Element}
 * @constructor
 */
const MessageList = () => {
  const messages = useSelector((state) => state.conversations.messages);
  const currentUserName = localStorage.getItem('userName');
  return (
    <Stack spacing={4} sx={{ overflowY: 'auto' }}>
      {messages.map((message, index) => {
        const isSent = message.sender.name === currentUserName;
        return (
          <Stack
            key={index}
            direction={isSent ? 'row-reverse' : 'row'}
            spacing={1}
          >
            <Avatar />
            <Stack
              direction="column"
              alignItems={isSent ? 'flex-end' : 'start'}
              spacing={1}
              flexGrow={1}
            >
              <Stack direction="row" spacing={1}>
                <Typography variant="body3">{message.sender.name}</Typography>
                <Typography variant="body4">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </Stack>
              <Paper
                variant="outlined"
                sx={{
                  display: 'inline-block',
                  maxWidth: 'fit-content',
                  py: 1,
                  px: 2,
                  textAlign: 'left',
                  flexGrow: 1,
                  borderRadius: 6,
                  backgroundColor: isSent ? '#6ab9f6' : 'white',
                }}
              >
                {message.type === 'image' ? (
                  <img width={250} height={250} src={message.body} alt="sent" />
                ) : (
                  <Typography variant="body3" color={isSent && 'white'}>
                    {message.body}
                  </Typography>
                )}
              </Paper>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

/**
 * ChatContent component
 * Contains the chat messages and message input field
 * Handles sending messages and uploading images
 * @returns {JSX.Element}
 * @constructor
 */
const ChatContent = () => {
  const fileInputRef = useRef(null);

  const currentConversation = useSelector(
    (state) => state.conversations.currentConversation,
  );
  const dispatch = useDispatch();
  const message = useSelector((state) => state.conversations.currentMessage);
  const currentUserName = localStorage.getItem('userName');
  const currentUserId = localStorage.getItem('userId');
  const receiverName = currentConversation?.participants.find(
    (participant) => participant.name !== currentUserName,
  );

  const handleMessageChange = (e) => {
    dispatch(setCurrentMessage(e.target.value));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('images', file);
      const BASE = import.meta.env.VITE_SERVER_URL;
      const uploadRes = await axios.post(`${BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = uploadRes.data.urls[0];
      dispatch(
        sendNewMessage({
          conversationId: currentConversation.id,
          sender: currentUserId,
          body: imageUrl,
          type: 'image',
        }),
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleSendMessage = () => {
    if (!currentConversation || !currentConversation.id || !message) return;
    dispatch(
      sendNewMessage({
        conversationId: currentConversation.id,
        sender: currentUserId,
        body: message,
        type: 'text',
      }),
    );
  };

  return currentConversation ? (
    <Grid item xs={9} sx={{ pl: 0, height: '100%' }}>
      <AppBar
        position="static"
        color="transparent"
        sx={{ boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.14)' }}
      >
        <Toolbar>
          <Avatar sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            textAlign="left"
          >
            {receiverName?.name}
          </Typography>
          {currentConversation.item && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'end',
                }}
              >
                <Typography variant="h6" textAlign="left">
                  {currentConversation.item.name}
                </Typography>
                <Typography variant="h7" textAlign="left">
                  ${currentConversation.item.price}
                </Typography>
              </Box>
              <img
                width="80px"
                height="80px"
                style={{ objectFit: 'cover' }}
                src={currentConversation.item.image[0]}
                alt={currentConversation.item.name}
              />
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          height: `calc(100% - 180px)`,
        }}
      >
        <MessageList />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write a message"
          value={message}
          onChange={handleMessageChange}
        />
        <Input
          accept="image/png, image/jpeg"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleImage}
        />
        <label htmlFor="raised-button-file">
          <IconButton component="span" color="primary">
            <AddToPhotosIcon />
          </IconButton>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSendMessage(message)}
        >
          <SendIcon />
        </Button>
      </Box>
    </Grid>
  ) : (
    // center
    <Grid
      xs={9}
      item
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4">Choose A Conversation To Start</Typography>
    </Grid>
  );
};

export default ChatContent;
