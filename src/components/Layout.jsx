import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './itemList/FilterLeftBar';
import { Box } from '@mui/material';
import Footer from './Footer';
import { useSelector } from 'react-redux';

/**
 * Layout component that renders the Header, Sidebar, Footer, and Outlet components
 * @returns {JSX.Element}
 */
const Layout = () => {
  const { searchTerm, filters } = useSelector((state) => state.items);
  const location = useLocation();

  return (
    <Box>
      <Header />
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'row',
          '@media (max-width: 600px)': {
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ maxWidth: 450 }}>
          {location.pathname === '/items' && <Sidebar />}
        </Box>
        <Box sx={{ flexGrow: 1, width: '100%', padding: 2 }}>
          <Outlet context={{ searchTerm, filters }} />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
