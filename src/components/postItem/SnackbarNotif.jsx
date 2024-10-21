import { React, useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';

/**
 * SnackbarNotif component
 * Displays a snackbar with a message
 * @param {Boolean} openSnackbar - Whether the snackbar is open
 * @param {String} snackbarMessage - The message to display in the snackbar
 * @param {Function} onCloseSnackbar - A function to handle closing the snackbar
 * @returns {JSX.Element}
 */
const SnackbarNotif = ({ openSnackbar, snackbarMessage, onCloseSnackbar }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openSnackbar);
  }, [openSnackbar]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    onCloseSnackbar();
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default SnackbarNotif;
