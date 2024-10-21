const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');
const Item = require('../models/item');
const Conversation = require('../models/conversation');

/**
 *  GET /conversation
 *  Query: convId
 *  Response: messages, conversation
 *  Description: Get all messages in a conversation
 */
router.get('/', async (req, res) => {
  // there are user1 and user2 in the query
  const { convId } = req.query;
  const conversation = await Conversation.findOne({
    _id: new mongoose.Types.ObjectId(convId),
  })
    .populate('participants', 'name isArchived')
    // name and image of the item
    .populate('item', 'name image price');

  if (!conversation) {
    return res.status(200).json({ messages: [] });
  }

  const isItemArchived = conversation.item
    ? conversation.item.isArchived
    : false;

  if (isItemArchived) {
    return res.status(403).json({
      error: 'Conversation is archived because the item is archived',
    });
  }

  // sort messages by createdAt
  const messages = await Message.find({
    conversation: conversation._id,
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name');

  res.status(200).json({ messages, conversation });
});

/**
 * POST /conversation/new
 * Request body: {senderId, receiverName, itemId}
 * Response: {messages, conversation}
 * Description: Create a new conversation
 * If the conversation already exists, return the messages
 * If the conversation does not exist, create a new conversation
 * If the conversation already exists but the item is different,
 * update the item in the conversation
 */
router.post('/new', async (req, res) => {
  const { senderId, receiverName, itemId } = req.body;

  // find the receiver by name
  const receiver = await User.findOne({ name: receiverName });
  console.log(receiver);
  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiver._id] },
  });
  if (conversation) {
    const conv = await Conversation.findOne({
      _id: conversation._id,
    })
      .populate('item', 'name image price')
      .populate('participants', 'name')
      .populate('lastMessage', 'body');
    if (conversation.item.toString() === itemId) {
      const messages = await Message.find({
        conversation: conversation._id,
      })
        .sort({ createdAt: 1 })
        .populate('sender', 'name');
      return res.status(200).json({ messages, conversation: conv, new: false });
    } else {
      conversation.item = new mongoose.Types.ObjectId(itemId);
      await conversation.save();
      const conv = await Conversation.findOne({
        _id: conversation._id,
      })
        .populate('item', 'name image price')
        .populate('participants', 'name')
        .populate('lastMessage', 'body');
      const messages = await Message.find({
        conversation: conversation._id,
      })
        .sort({ createdAt: 1 })
        .populate('sender', 'name');
      return res.status(200).json({ messages, conversation: conv, new: false });
    }
  }
  const newConversation = new Conversation({
    participants: [senderId, receiver._id],
    item: new mongoose.Types.ObjectId(itemId),
  });

  const savedConversation = await newConversation.save();
  // add item to conversation
  const messages = [];
  // populate item name and image
  const populatedConversation = await Conversation.findOne({
    _id: savedConversation._id,
  })
    .populate('participants', 'name')
    .populate('item', 'name image price')
    .populate('lastMessage', 'body')
    .lean();

  // Filter out the current user from participants
  const otherParticipants = populatedConversation.participants.filter(
    (participant) => participant._id.toString() !== senderId,
  );
  // replace _id with id
  if (populatedConversation._id) {
    populatedConversation.id = populatedConversation._id.toString();
    delete populatedConversation._id;
  }
  const detailedConversation = {
    ...populatedConversation,
    participants: otherParticipants,
    lastMessage: populatedConversation.lastMessage,
  };
  res
    .status(201)
    .json({ messages, conversation: detailedConversation, new: true });
});

/**
 * POST /conversation/new/:id
 * Request Body: {sender, body, type}
 * Response: messages
 * Description: Add a new message to a conversation
 */
router.post('/new/:id', async (req, res) => {
  const { id } = req.params;
  const { sender, body, type } = req.body;
  // find by id + sender
  const conversation = await Conversation.findOne({
    _id: new mongoose.Types.ObjectId(id),
    participants: new mongoose.Types.ObjectId(sender),
  });
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  const newMessage = new Message({
    conversation: conversation._id,
    sender: new mongoose.Types.ObjectId(sender),
    body,
    type,
  });
  const savedMessage = await newMessage.save();
  // update lastMessage and lastUpdated in conversation
  conversation.lastMessage = savedMessage._id;
  conversation.lastUpdated = new Date();
  await conversation.save();
  // return all messages in the conversation
  const messages = await Message.find({
    conversation: conversation._id,
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name');
  res.status(201).json(messages);
});

/**
 * GET /conversation/list
 * Query: userId
 * Response: conversations
 * Description: Get all conversations where the user is a participant
 */
router.get('/list', async (req, res) => {
  const { userId } = req.query;
  console.log(userId);

  // find all conversations where the user is a participant
  // in the return value, only keep the name of the other participant
  let conversations = await Conversation.find({
    participants: userId,
  })
    .populate('participants', 'name isArchived')
    .populate('item', 'name image price')
    .populate('lastMessage', 'body')
    .lean();

  conversations = await Promise.all(
    conversations.map(async (conversation) => {
      if (conversation.item) {
        const item = await Item.findById(conversation.item._id);
        // const isItemArchived = item ? item.isArchived : false;
        // if (isItemArchived) {
        //   return null; // Skip archived conversations
        // }
        if (item && item.isArchived) {
          return null; // Skip archived conversations
        }
      }
      return conversation;
    }),
  );

  conversations = conversations.filter((convo) => convo !== null);

  const processedConversations = conversations.map((conversation) => {
    // Filter out the current user from participants
    const otherParticipants = conversation.participants.filter(
      (participant) => participant._id.toString() !== userId,
    );

    const { _id, ...restConversation } = conversation;
    // Return the modified conversation object
    return {
      id: _id.toString(),
      ...restConversation,
      participants: otherParticipants,
      lastMessage: conversation.lastMessage,
      lastUpdated: conversation.lastUpdated,
    };
  });

  res.status(200).json(processedConversations);
});

module.exports = router;
