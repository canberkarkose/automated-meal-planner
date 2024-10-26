import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

import { db } from '../firebase-config';
import { useAuth } from '../contexts/AuthContext';

import { usePrevious } from '@src/hooks/usePrevious';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState('');
  const location = useLocation();

  const previousUser = usePrevious(user);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Check if the user has just logged out
      if (previousUser && !user) {
        toast.info('You have been logged out.', { position: 'bottom-left' });
      } else {
        toast.error('Please log in to access this page.', { position: 'bottom-left' });
      }
      setShouldRedirect('/login');
    } else {
      const fetchUserDetails = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const { accountDetailsCompleted } = docSnap.data();

            if (!accountDetailsCompleted && !location.pathname.includes('/app/account-details')) {
              // Redirect to account details page if not completed
              setShouldRedirect('/app/account-details');
            } else if (accountDetailsCompleted && location.pathname.includes('/app/account-details')) {
              // Redirect to dashboard if account details are already completed
              toast.info(
                'Your account details are already configured. Visit profile settings to make changes.',
                { position: 'bottom-left' }
              );
              setShouldRedirect('/app/dashboard');
            } else {
              setIsInitialCheckComplete(true);
            }
          } else {
            console.error('No such document!');
            setIsInitialCheckComplete(true);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setIsInitialCheckComplete(true);
        }
      };
      fetchUserDetails();
    }
  }, [user, loading, location.pathname]);

  if (loading || !isInitialCheckComplete) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} replace />;
  }

  return <Outlet />;
};
