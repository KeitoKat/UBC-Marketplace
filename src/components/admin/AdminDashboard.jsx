import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchItems, deleteItem } from '../../redux/actions';
import {
  fetchAllItemReports,
  resolveItemReport,
} from '../../redux/itemReportActions';
import {
  fetchAllUserReports,
  resolveUserReport,
} from '../../redux/userReportActions';
import { deleteUser } from '../../redux/usersReducer';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

/**
 * AdminDashboard component
 * Displays a list of posts, item reports, and user reports
 * Admins can delete posts, resolve item reports, and resolve user reports
 * @returns {JSX.Element}
 */
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const posts = useSelector((state) => state.items.itemList);
  const itemReports = useSelector((state) => state.itemReports.reports);
  const userReports = useSelector((state) => state.userReports.reports);

  const [tab, setTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    dispatch(
      fetchItems({ search: '', category: '', minPrice: 0, maxPrice: 3000 }),
    );
    dispatch(fetchAllItemReports());
    dispatch(fetchAllUserReports());
  }, [dispatch]);

  if (!loggedInUser?.isAdmin) {
    return <Navigate to="/" />;
  }

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleDeletePost = async (postId) => {
    if (!postId) {
      console.error('Post ID is undefined');
      setSnackbarMessage('Failed to delete post: Post ID is undefined');
      setSnackbarOpen(true);
      return;
    }
    console.log('Deleting post with ID:', postId);
    await dispatch(deleteItem(postId));
    setSnackbarMessage('Post deleted successfully');
    setSnackbarOpen(true);
    dispatch(
      fetchItems({ search: '', category: '', minPrice: 0, maxPrice: 3000 }),
    );
  };

  const handleResolveItemReport = async (reportId) => {
    if (!reportId) {
      console.error('Report ID is undefined');
      setSnackbarMessage('Failed to resolve report: Report ID is undefined');
      setSnackbarOpen(true);
      return;
    }
    console.log('Resolving report with ID:', reportId);
    await dispatch(resolveItemReport(reportId));
    setSnackbarMessage('Report resolved successfully');
    setSnackbarOpen(true);
    dispatch(fetchAllItemReports());
  };

  const handleResolveUserReport = async (reportId) => {
    if (!reportId) {
      console.error('Report ID is undefined');
      setSnackbarMessage('Failed to resolve report: Report ID is undefined');
      setSnackbarOpen(true);
      return;
    }
    console.log('Resolving report with ID:', reportId);
    await dispatch(resolveUserReport(reportId));
    setSnackbarMessage('Report resolved successfully');
    setSnackbarOpen(true);
    dispatch(fetchAllUserReports());
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      console.error('User ID is undefined');
      setSnackbarMessage('Failed to delete user: User ID is undefined');
      setSnackbarOpen(true);
      return;
    }
    console.log('Deleting user with ID:', userId);
    await dispatch(deleteUser(userId));
    setSnackbarMessage('User deleted successfully');
    setSnackbarOpen(true);
    dispatch(fetchAllUserReports());
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setSelectedReport(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Manage Posts" />
        <Tab label="Manage Item Reports" />
        <Tab label="Manage User Reports" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <List>
          {posts.map((post) => (
            <ListItem
              button
              key={post.id}
              onClick={() => setSelectedItem(post)}
            >
              <ListItemText
                primary={post.name}
                secondary={`Category: ${post.category}, Condition: ${post.condition}`}
              />
              <ListItemSecondaryAction>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <List>
          {itemReports.map((report) => (
            <ListItem
              button
              key={report._id}
              onClick={() => setSelectedReport(report)}
            >
              <ListItemText
                primary={`Report Reason: ${report.reason}`}
                secondary={`Reported Item: ${
                  report.reportedItem
                    ? report.reportedItem.name
                    : 'Item not found'
                }, Status: ${report.status}`}
              />
              <ListItemSecondaryAction>
                {report.status === 'pending' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleResolveItemReport(report._id)}
                  >
                    Resolve
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <List>
          {userReports.map((report) => (
            <ListItem
              button
              key={report._id}
              onClick={() => setSelectedReport(report)}
            >
              <ListItemText
                primary={`Report Reason: ${report.reason}`}
                secondary={`Reported User: ${
                  report.reportedUser
                    ? report.reportedUser.name
                    : 'User not found'
                }, Status: ${report.status}`}
              />
              <ListItemSecondaryAction>
                {report.status === 'pending' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleResolveUserReport(report._id)}
                  >
                    Resolve
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </TabPanel>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
      <Dialog open={Boolean(selectedItem)} onClose={handleCloseDialog}>
        <DialogTitle>Item Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <DialogContentText>
              <strong>Name:</strong> {selectedItem.name}
              <br />
              <strong>Category:</strong> {selectedItem.category}
              <br />
              <strong>Condition:</strong> {selectedItem.condition}
              <br />
              <strong>Description:</strong> {selectedItem.description}
              <br />
              <strong>Price:</strong> ${selectedItem.price}
              <br />
              <strong>Location:</strong> {selectedItem.location}
              <br />
              <strong>Owner:</strong> {selectedItem.owner.name}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(selectedReport)} onClose={handleCloseDialog}>
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <DialogContentText>
              <strong>Reason:</strong> {selectedReport.reason}
              <br />
              <strong>Reported By:</strong> {selectedReport.reportedBy.name}
              <br />
              <strong>Status:</strong> {selectedReport.status}
              <br />
              {selectedReport.reportedItem && (
                <>
                  <strong>Reported Item:</strong>{' '}
                  {selectedReport.reportedItem.name}
                  <br />
                  <strong>Item Description:</strong>{' '}
                  {selectedReport.reportedItem.description}
                </>
              )}
              {selectedReport.reportedUser && (
                <>
                  <strong>Reported User:</strong>{' '}
                  {selectedReport.reportedUser.name}
                </>
              )}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {selectedReport && selectedReport.reportedUser && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteUser(selectedReport.reportedUser._id)}
            >
              Delete User
            </Button>
          )}
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default AdminDashboard;
