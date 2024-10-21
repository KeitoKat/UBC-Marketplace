import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/usersReducer';

/**
 * Signup component displays a form for users to sign up
 * @returns {JSX.Element}
 */
const Signup = ({ onClose }) => {
  const [user, setUser] = useState({
    name: '',
    emailPart1: '',
    emailPart2: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const dispatch = useDispatch();
  const registerStatus = useSelector((state) => state.users.registerStatus);
  const registerError = useSelector((state) => state.users.registerError);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      validateMobile(value);
    }
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (name === 'password') {
      validatePassword(value);
    }

    if (name === 'confirmPassword') {
      validateConfirmPassword(value, user.password);
    }
  };

  const validatePassword = (password) => {
    const passwordCriteria =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@_-]).{8,}$/;
    if (!passwordCriteria.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@_-).',
      );
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateMobile = (mobile) => {
    const formattedMobile = mobile.replace(/\D/g, '');
    if (formattedMobile.length !== 10) {
      setMobileError('Mobile number must be 10 digits.');
    } else {
      setMobileError('');
      setUser((prevUser) => ({
        ...prevUser,
        mobile: formattedMobile,
      }));
    }
  };

  const formatMobile = (mobile) => {
    const formattedMobile = mobile.replace(/\D/g, '');
    const match = formattedMobile.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return mobile;
  };

  const handleSignup = () => {
    const { name, emailPart1, emailPart2, mobile, password, confirmPassword } =
      user;
    if (!name || !emailPart1 || !mobile || !password || !confirmPassword) {
      alert('All fields are required!');
      return;
    }
    if (passwordError || confirmPasswordError || mobileError) {
      alert('Please fix the errors in the form.');
      return;
    }
    const email = emailPart2
      ? `${emailPart1}@${emailPart2}.ubc.ca`
      : `${emailPart1}@ubc.ca`;
    const userData = { ...user, email, mobile: formatMobile(mobile) };
    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        setMessage(
          'Registration successful! Please check your email to verify your account.',
        );
        setDialogOpen(true);
      })
      .catch((error) => {
        setMessage('Registration failed: ' + (error || 'Unknown error'));
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (onClose) onClose();
  };

  const handleAgreementOpen = () => {
    setAgreementOpen(true);
  };

  const handleAgreementClose = () => {
    setAgreementOpen(false);
  };

  const handleAgreedChange = (event) => {
    setAgreed(event.target.checked);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={user.name}
          onChange={handleChange}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Email"
            name="emailPart1"
            fullWidth
            margin="normal"
            value={user.emailPart1}
            onChange={handleChange}
          />
          <Typography sx={{ alignSelf: 'center' }}>@</Typography>
          <TextField
            label="Optional"
            name="emailPart2"
            fullWidth
            margin="normal"
            value={user.emailPart2}
            onChange={handleChange}
            placeholder="optional"
          />
          <Typography sx={{ alignSelf: 'center' }}>.ubc.ca</Typography>
        </Box>
        {registerError === 'Email must end with ubc.ca' && (
          <Typography variant="subtitle2" color="error">
            {registerError}
          </Typography>
        )}
        {registerError === 'Email already exists' && (
          <Typography variant="subtitle2" color="error">
            {registerError}
          </Typography>
        )}
        <TextField
          label="Mobile"
          name="mobile"
          fullWidth
          margin="normal"
          value={user.mobile}
          onChange={handleChange}
          error={!!mobileError}
          // helperText={mobileError ? mobileError : 'Format: XXX-XXX-XXXX'}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={user.password}
          onChange={handleChange}
          error={!!passwordError}
          helperText={passwordError}
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          margin="normal"
          value={user.confirmPassword}
          onChange={handleChange}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={agreed}
              onChange={handleAgreedChange}
              name="agreed"
            />
          }
          label={
            <>
              I have read and agree to the{' '}
              <Button onClick={handleAgreementOpen} color="primary">
                Service Agreement
              </Button>
            </>
          }
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignup}
          disabled={!agreed || registerStatus === 'loading'}
        >
          Sign Up
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Registration successful! Please check your email to verify your
            account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={agreementOpen} onClose={handleAgreementClose}>
        <DialogTitle>Service Agreement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1">
              <h3>Service Agreement</h3>
              <p>
                Welcome to UBC Marketplace. By using our services, you agree to
                comply with and be bound by the following terms and conditions
                of use. Please review these terms carefully.
              </p>
              <h4>Acceptance of Agreement</h4>
              <p>
                You agree to the terms and conditions outlined in this Service
                Agreement with respect to our site (UBC Marketplace). This
                Agreement constitutes the entire and only agreement between us
                and you, and supersedes all prior or contemporaneous agreements,
                representations, warranties, and understandings with respect to
                the site, the content, products, or services provided by or
                through the site.
              </p>
              <h4>Modification of Agreement</h4>
              <p>
                We reserve the right to modify this Agreement at any time, and
                such modifications shall be effective immediately upon posting
                of the modified Agreement on the site. You agree to review the
                Agreement periodically to be aware of such modifications, and
                your continued access or use of the site shall be deemed your
                conclusive acceptance of the modified Agreement.
              </p>
              <h4>Use of the Site</h4>
              <p>
                You agree to use the site only for lawful purposes. You are
                prohibited from posting on or transmitting through the site any
                material that violates or infringes the rights of others, or
                that is threatening, abusive, defamatory, invasive of privacy or
                publicity rights, vulgar, obscene, profane, or otherwise
                objectionable, that encourages conduct that would constitute a
                criminal offense, give rise to civil liability, or otherwise
                violate any law.
              </p>
              <h4>Termination</h4>
              <p>
                We may terminate your access to the site at any time, without
                notice, for conduct that we believe violates this Agreement or
                is harmful to other users of the site, us, or third parties, or
                for any other reason.
              </p>
              <h4>Disclaimer</h4>
              <p>
                The content, services, and products on our site are provided "as
                is" and without warranties of any kind, either express or
                implied.
              </p>
              <h4>Limitation of Liability</h4>
              <p>
                Under no circumstances shall we be liable for any direct,
                indirect, incidental, special, or consequential damages that
                result from the use of, or the inability to use, the site,
                including our messaging, blogs, comments of others, books,
                emails, products, or services, or third-party materials,
                products, or services made available through the site.
              </p>
              <h4>Indemnity</h4>
              <p>
                You agree to indemnify, defend, and hold harmless UBC
                Marketplace, its officers, directors, employees, agents,
                licensors, suppliers, and any third-party information providers
                to the site from and against all losses, expenses, damages, and
                costs, including reasonable attorneys' fees, resulting from any
                violation of this Agreement by you or any other person accessing
                the site.
              </p>
              <p>
                This Agreement shall be governed by and construed in accordance
                with the laws of the jurisdiction in which UBC is located,
                without regard to its conflict of law provisions.
              </p>
              <h4>Contact Information</h4>
              <p>
                If you have any questions about this Agreement, please contact
                us at support@ubcmarketplace.com.
              </p>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAgreementClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Signup;
