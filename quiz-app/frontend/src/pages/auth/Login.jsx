import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import authService from '../../services/authService';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined as LockIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    setLocalError('');

    try {
      const res = await authService.login({
        email: data.email,
        password: data.password,
      });

      if (res.data.success) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token,
          })
        );
        
        // Redirect based on role
        const role = res.data.user.role;
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/quiz', { replace: true });
        }
      } else {
        const errorMsg = res.data.msg || 'Login failed';
        dispatch(loginFailure(errorMsg));
        setLocalError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Invalid credentials or connection issue';
      dispatch(loginFailure(errorMsg));
      setLocalError(errorMsg);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Container maxWidth="xs">
        <Card elevation={4} className="border-0">
          <CardContent className="p-8">
            <Box className="flex flex-col items-center mb-6">
              <Box sx={{ bgcolor: 'primary.main', p: 1.5, borderRadius: '50%', color: 'white', mb: 2 }}>
                <LockIcon fontSize="medium" />
              </Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                Sign In to QuizMaster
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mt-1">
                Enter your details to access your account
              </Typography>
            </Box>

            {(error || localError) && (
              <Alert severity="error" className="mb-4" onClose={() => setLocalError('')}>
                {localError || error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                disabled={loading}
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                disabled={loading}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" defaultChecked />}
                label="Remember me"
                className="mt-1 mb-2 text-sm"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ py: 1.2, mt: 1, mb: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Box className="text-center mt-2">
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link to="/auth/register" className="text-indigo-600 hover:text-indigo-800 font-medium no-underline">
                    Register
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
