import {
  Box, Typography, Button, TextField, Divider, IconButton, InputAdornment,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { Space } from '../../atoms/Space/Space';

import { login, googleSignIn } from '../../../services/auth-service';

import { useAuth } from '../../../contexts/AuthContext';

import { GlobalBackground } from '../LandingPage/LandingPage.styles';

import { ContentContainer } from './Login.styles';

import { CustomIconButtonAndText } from '@components/molecules/CustomIconButtonAndText/CustomIconButtonAndText';

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmailError, setUsernameOrEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      if (localStorage.getItem('justLoggedIn')) {
        localStorage.removeItem('justLoggedIn');
      } else {
        toast.info('You are already logged in. Accessing another account? Please log out first.', { position: 'bottom-left' });
        navigate('/app/dashboard');
      }
    }
  }, [user, authLoading]);

  if (authLoading || user || isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  const handleUsernameOrEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmailOrUsername = event.target.value;
    setUsernameOrEmail(newEmailOrUsername);
    if (newEmailOrUsername.endsWith('@gmail.com')) {
      setUsernameOrEmailError('Please continue with Google below for Gmail accounts.');
    }
    if (usernameOrEmailError) setUsernameOrEmailError('');
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (passwordError) setPasswordError('');
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  /* istanbul ignore next */
  const handleSignIn = async () => {
    if (!usernameOrEmail || !password) {
      if (!usernameOrEmail) setUsernameOrEmailError('Please provide your username or email.');
      if (!password) setPasswordError('Please provide your password.');
      return;
    }
    try {
      setIsLoading(true);
      await login(usernameOrEmail, password);
      localStorage.setItem('justLoggedIn', 'true');
      setTimeout(() => {
        navigate('/app/dashboard');
        toast.success('Successfully logged in.', { position: 'bottom-left' });
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      // Check if error is an instance of Error and contains expected properties
      if (error instanceof Error && 'message' in error) {
        const { message } = error;

        if (message.includes('No user found')) {
          toast.error('No user found with the given username or email.', { position: 'bottom-left' });
        } else if (message.includes('invalid-credential')) {
          toast.error('Invalid credentials.', { position: 'bottom-left' });
        } else if (message.includes('too-many-requests')) {
          toast.error('Too many failed login attempts. Please reset your password or try again later.', { position: 'bottom-left' });
        } else {
          toast.error(message, { position: 'bottom-left' });
        }
      } else {
        toast.error('An unexpected error occurred.', { position: 'bottom-left' });
      }
    }
  };

  /* istanbul ignore next */
  const handleGoogleSignIn = async () => {
    try {
      localStorage.setItem('justLoggedIn', 'true');
      const { user: signedInUser, isNewUser } = await googleSignIn();

      if (signedInUser) {
        if (isNewUser) {
          navigate('/app/account-details');
        } else {
          setTimeout(() => {
            navigate('/app/dashboard');
            toast.success('Successfully signed in with Google.', {
              position: 'bottom-left',
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      toast.error('Google sign-in failed. Please try again.', { position: 'bottom-left' });
    }
  };

  /* istanbul ignore next */
  return (
    <GlobalBackground>
      <ContentContainer>
        <Box
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <CustomIconButtonAndText
            icon={<ArrowBackIcon />}
            text='Sign in to Bite by Byte'
            onIconClick={() => navigate('/')}
            tooltip='Go back to home'
          />
          <Box sx={{
            width: '100%', minHeight: 'calc(100vh - 400px)', display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}
          >
            <TextField
              fullWidth
              variant='outlined'
              label='Email or username'
              value={usernameOrEmail}
              onChange={handleUsernameOrEmailChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSignIn();
                }
              }}
              error={!!usernameOrEmailError}
              helperText={usernameOrEmailError}
              sx={{ marginBottom: 2, mt: 3 }}
            />
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              variant='outlined'
              value={password}
              label='Password'
              error={!!passwordError}
              helperText={passwordError}
              onChange={handlePasswordChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSignIn();
                }
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={togglePasswordVisibility} data-testid='toggle-password'>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              mb: 2,
            }}
            >
              <Button color='secondary' onClick={() => navigate('/forgot-password')} sx={{ textTransform: 'none' }}>
                Forgot Password?
              </Button>
            </Box>
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              onClick={handleSignIn}
              sx={{ borderRadius: 20, textTransform: 'none' }}
            >
              <Typography fontSize='18px'>Log In</Typography>
            </Button>
            <Space s24 />
            <Divider sx={{ margin: '20px 0', position: 'relative' }}>
              <Typography
                sx={{
                  position: 'absolute', top: '-12px', left: 'calc(50% - 16px)', padding: '0 10px'
                }}
              >
                or
              </Typography>
            </Divider>
            <Space s24 />
            <Button
              fullWidth
              variant='outlined'
              onClick={handleGoogleSignIn}
              sx={{
                color: 'black', borderColor: 'black', mb: 1, borderRadius: 20, textTransform: 'none',
              }}
            >
              <Box sx={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GoogleIcon sx={{ mr: 11.5, color: 'red' }} />
                  <Typography fontSize='18px'>Continue with Google</Typography>
                </Box>
              </Box>
            </Button>
            <Space s24 />
            <Divider sx={{ margin: '20px 0' }} />
            <Space s24 />
            <Typography textAlign='center'>
              Don’t have an account yet?
              {' '}
              <Link to='/register'>Sign up to Bite by Byte!</Link>
            </Typography>
          </Box>
        </Box>
      </ContentContainer>
    </GlobalBackground>
  );
};
