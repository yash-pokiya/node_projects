import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff, AccountCircleOutlined as UserIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const schema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
    email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    role: z.enum(['admin', 'user'], {
      required_error: 'Role is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (res.data.success) {
        setSuccessMsg('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        setErrorMsg(res.data.msg || 'Registration failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      const backendError = err.response?.data?.msg || 'An unexpected error occurred. Please try again.';
      setErrorMsg(backendError);
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Container maxWidth="xs">
        <Card elevation={4} className="border-0">
          <CardContent className="p-8">
            <Box className="flex flex-col items-center mb-6">
              <Box sx={{ bgcolor: 'secondary.main', p: 1.5, borderRadius: '50%', color: 'white', mb: 2 }}>
                <UserIcon fontSize="medium" />
              </Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                Create an Account
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mt-1">
                Join QuizMaster to manage or attempt quizzes
              </Typography>
            </Box>

            {errorMsg && (
              <Alert severity="error" className="mb-4" onClose={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}

            {successMsg && (
              <Alert severity="success" className="mb-4">
                {successMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                margin="dense"
                required
                fullWidth
                label="Full Name"
                disabled={isSubmitting}
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              
              <TextField
                margin="dense"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                disabled={isSubmitting}
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <FormControl fullWidth margin="dense" error={!!errors.role}>
                <InputLabel id="role-select-label">Account Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role"
                  label="Account Role"
                  defaultValue="user"
                  disabled={isSubmitting}
                  onChange={(e) => setValue('role', e.target.value)}
                >
                  <MenuItem value="user">User (Quiz Taker)</MenuItem>
                  <MenuItem value="admin">Admin (Quiz Maker)</MenuItem>
                </Select>
                <FormHelperText>{errors.role?.message}</FormHelperText>
              </FormControl>
              
              <TextField
                margin="dense"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                disabled={isSubmitting}
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

              <TextField
                margin="dense"
                required
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                disabled={isSubmitting}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                sx={{ py: 1.2, mt: 3, mb: 2 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Register'
                )}
              </Button>

              <Box className="text-center mt-2">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="text-pink-600 hover:text-pink-800 font-medium no-underline">
                    Sign In
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
