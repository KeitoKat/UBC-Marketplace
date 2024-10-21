import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import Layout from './components/Layout.jsx';
import ItemListing from './components/itemList/ItemListing.jsx';
import MyListing from './components/itemList/MyListing.jsx';
import Welcome from './components/Welcome.jsx';
import ProfilePage from './components/profileSubmenu/ProfilePage.jsx';
import Settings from './components/profileSubmenu/Setting.jsx';
import '@mui/material/colors';
import { blue, red, yellow, grey, blueGrey } from '@mui/material/colors';
import Chat from './components/chat/Chat.jsx';
import EmailVerification from './components/authentication/EmailVerification.jsx';
import PostNew from './components/postItem/PostNew.jsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import ItemEdit from './components/postItem/ItemEdit.jsx';
import UserEdit from './components/profileSubmenu/UserEdit.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import { loginUserAction } from './redux/usersReducer'; // Import the loginUserAction

const theme = createTheme({
  typography: {
    body3: {
      color: grey[700],
      fontSize: '0.9rem',
      fontWeight: 500,
      fontFamily: 'Roboto, Helvetica, Arial ,sans-serif',
    },
    body4: {
      color: grey[700],
      fontSize: '0.7rem',
      fontWeight: 400,
      fontFamily: 'Roboto, Helvetica, Arial ,sans-serif',
    },
  },
  palette: {
    primary: {
      main: blueGrey[500],
    },
    secondary: {
      main: blueGrey[100],
    },
    error: {
      main: red[500],
    },
    warning: {
      main: yellow[500],
    },
    info: {
      main: blue[500],
    },
  },
});

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user info is saved in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch(loginUserAction.fulfilled(user)); // Dispatch action to update Redux store with saved user info
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Routes location={location}>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Welcome />} />
              <Route path="items" element={<ItemListing />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                path="email-verification"
                element={<EmailVerification />}
              />
              <Route path="itemlisting" element={<MyListing />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chats" element={<Chat />} />
              <Route path="post-new" element={<PostNew />} />
              <Route path="edit-item/:id" element={<ItemEdit />} />
              <Route path="edit-user/:id" element={<UserEdit />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </ThemeProvider>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
