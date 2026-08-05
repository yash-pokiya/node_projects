import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  Stack,
} from '@mui/material';
import {
  AssignmentTurnedIn as QuizIcon,
  Dashboard as AdminIcon,
  Speed as PerformanceIcon,
  ArrowForward as ArrowIcon,
  Login as LoginIcon,
} from '@mui/icons-material';

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  const features = [
    {
      title: 'Rich Question Creator',
      description: 'Create single-choice and multiple-choice questions with dynamic option sizes (2 to 5 options) and instant validator mappings.',
      icon: <QuizIcon color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Protected Admin Controls',
      description: 'Role-protected controls allow designated quiz makers to view stats charts, inspect details, update inventories, and perform database CRUD.',
      icon: <AdminIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Visual Grade Reports',
      description: 'Instantly view graded performance reports, complete letter grade awards, and color-coded visual check indicators on correct answer selections.',
      icon: <PerformanceIcon color="success" sx={{ fontSize: 40 }} />,
    },
  ];

  const renderCTA = () => {
    if (user) {
      const isAlt = user.role === 'admin';
      return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="justify-center">
          <Link href={isAlt ? '/admin' : '/quiz'} className="no-underline">
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{ px: 4, py: 1.5, fontSize: 16, fontWeight: 700 }}
            >
              {isAlt ? 'Go to Admin Dashboard' : 'Go to Quiz Lobby'}
            </Button>
          </Link>
        </Stack>
      );
    }

    return (
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="justify-center">
        <Link to="/auth/login" className="no-underline">
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<LoginIcon />}
            sx={{ px: 4, py: 1.5, fontSize: 16, fontWeight: 700 }}
          >
            Sign In
          </Button>
        </Link>
        <Link to="/auth/register" className="no-underline">
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: 16, fontWeight: 700 }}
          >
            Create Free Account
          </Button>
        </Link>
      </Stack>
    );
  };

  return (
    <Box className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
      {/* Navbar Banner */}
      <Box className="border-b border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 py-4 px-6 md:px-12 flex justify-between items-center">
        <Box className="flex items-center gap-2">
          <QuizIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }} color="text.primary">
            QuizMaster
          </Typography>
        </Box>
        <Box>
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/quiz'} className="no-underline">
              <Button variant="outlined" size="small">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth/login" className="no-underline">
              <Button variant="contained" size="small">
                Login
              </Button>
            </Link>
          )}
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="md" className="py-16 md:py-24 text-center flex-1 flex flex-col justify-center">
        <Box
          sx={{
            display: 'inline-block',
            bgcolor: 'primary.lighter',
            color: 'primary.dark',
            px: 2,
            py: 0.8,
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: 0.5,
            mb: 3,
            textTransform: 'uppercase',
          }}
        >
          Dynamic Web-Based Exam Suite
        </Box>
        
        <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 3 }} color="text.primary">
          Master Any Subject With{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            QuizMaster
          </Box>
        </Typography>

        <Typography variant="h6" color="text.secondary" className="max-w-2xl mx-auto font-medium mb-8 leading-relaxed">
          Create, administer, and attempt interactive quizzes. Securely monitor question banks as an Administrator, or complete sample tests and analyze instant grades as a user.
        </Typography>

        <Box className="mb-16">
          {renderCTA()}
        </Box>

        {/* Features Grids */}
        <Grid container spacing={4}>
          {features.map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card elevation={2} className="h-full hover:-translate-y-1 transition-transform border border-solid border-gray-100 dark:border-gray-800">
                <CardContent className="p-6 text-left flex flex-col gap-4">
                  <Box>{feature.icon}</Box>
                  <Typography variant="h6" className="font-extrabold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="leading-relaxed">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer Banner */}
      <Box className="border-t border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 py-6 text-center">
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} QuizMaster Platform. Created by Antigravity Coding Assistant.
        </Typography>
      </Box>
    </Box>
  );
}
