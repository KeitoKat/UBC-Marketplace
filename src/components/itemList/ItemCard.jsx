import React, { useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import ItemModal from './ItemModal';
import { useSelector } from 'react-redux';

/**
 * ItemCard component
 * Displays an item card with an image, name, price, and owner
 * Handles opening and closing the item modal
 * @param {Object} item - The item object to display
 * @param {Boolean} isOwned - Whether the item is owned by the logged in user
 * @returns {JSX.Element}
 */
const ItemCard = ({ item, isOwned }) => {
  const [open, setOpen] = useState(false);
  const loggedInUser = useSelector((state) => state.users.loggedInUser);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 280,
          height: 400,
          borderRadius: 3,
          cursor: 'pointer',
          border: '#e1e1e1 1px solid',
          paddingBottom: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          '&:hover': {
            '.MuiCardMedia-root': {
              transform: 'scale(1.1)',
            },
          },
        }}
        onClick={handleOpenModal}
      >
        {isOwned && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#063970',
              color: 'white',
              padding: '2px 8px',
              borderRadius: 2,
              fontStyle: 'bold',
              fontFamily: 'Arial',
              zIndex: 1,
            }}
          >
            Owner
          </Box>
        )}
        <Box
          sx={{
            height: 280,
            width: 280,
            maxHeight: 280,
            overflow: 'hidden',
            borderBottom: '#e1e1e1 1px solid',
          }}
        >
          <CardMedia
            sx={{
              width: '100%',
              height: '100%',
              transition: 'transform .45s ease-in-out,opacity .3s linear',
            }}
            image={item.image[0]}
            title={item.name}
          />
        </Box>
        <CardContent
          sx={{
            textAlign: 'left',
            flexGrow: 1,
          }}
        >
          <Typography variant="body1" color="text.secondary" fontWeight={400}>
            ${item.price}
          </Typography>
          <Typography
            gutterBottom
            variant="h5"
            fontWeight={500}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {item.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={400}>
            Owned by: {item.owner.name}
          </Typography>
        </CardContent>
      </Card>
      <ItemModal
        open={open}
        onClose={handleCloseModal}
        item={item}
        userId={loggedInUser?.id}
      />
    </>
  );
};

export default ItemCard;
