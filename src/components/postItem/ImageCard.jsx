import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

/**
 * ImageCard component
 * Displays an image card with an image, a delete icon, and a preview dialog
 * @param {String} image - The URL of the image to display
 * @param {Function} onDeleteImage - A function to handle deleting the image
 * @returns {JSX.Element}
 */
const ImageCard = ({ image, onDeleteImage }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card
        sx={{ maxWidth: 345, position: 'relative', display: 'flex' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="Uploaded Image"
          className="cardMedia"
          onClick={handleOpenDialog}
        />
        <CardContent sx={{ padding: 0 }}>
          <IconButton
            className="deleteIcon"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'red',
              display: hovered ? 'block' : 'none',
            }}
            onClick={() => onDeleteImage(image)}
          >
            <CloseIcon />
          </IconButton>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img
            src={image}
            alt="Full Image"
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCard;
