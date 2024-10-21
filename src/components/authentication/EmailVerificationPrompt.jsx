import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

/**
 * EmailVerificationPrompt component
 * Displays a dialog prompting the user to check their email for verification
 * @param {boolean} open - dialog open state
 * @param {Function} onClose - dialog close handler
 * @returns {JSX.Element}
 */
const EmailVerificationPrompt = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Email Verification</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Registration successful! Please check your email to verify your account.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default EmailVerificationPrompt;
