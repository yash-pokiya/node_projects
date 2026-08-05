'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useColorMode } from '../../App';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Assignment as QuizIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary' }} elevation={1}>
      <Toolbar className="flex justify-between items-center px-4 md:px-6">
        {/* Left section: Hamburger (mobile) + Logo */}
        <Box className="flex items-center gap-2">
          {user && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              className="mr-2 lg:hidden"
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Link href={user ? (user.role === 'admin' ? '/admin' : '/quiz') : '/'} className="flex items-center gap-2 no-underline text-inherit">
            <QuizIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
              QuizMaster
            </Typography>
          </Link>
        </Box>

        {/* Right section: Toggles + Profile */}
        <Box className="flex items-center gap-4">
          {/* Light/Dark mode toggle */}
          <Tooltip title={`Toggle ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          {user ? (
            <Box className="flex items-center gap-2">
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
                {user.name}
              </Typography>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} className="p-0">
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 36, height: 36, fontSize: 16 }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
              >
                <Box className="px-4 py-2 border-b border-solid border-gray-100 dark:border-gray-800">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.role === 'admin' ? 'Administrator' : 'Quiz Taker'}
                  </Typography>
                </Box>
                
                {user.role === 'admin' && (
                  <Link href="/admin" className="no-underline text-inherit">
                    <MenuItem onClick={handleCloseUserMenu} className="gap-2">
                      <DashboardIcon fontSize="small" />
                      Dashboard
                    </MenuItem>
                  </Link>
                )}

                <Link href="/quiz" className="no-underline text-inherit">
                  <MenuItem onClick={handleCloseUserMenu} className="gap-2">
                    <QuizIcon fontSize="small" />
                    Quizzes
                  </MenuItem>
                </Link>

                <MenuItem onClick={handleLogout} className="gap-2 text-red-500">
                  <LogoutIcon fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box className="flex gap-2">
              <Link href="/auth/login" className="no-underline">
                <Button variant="text" color="inherit">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" className="no-underline">
                <Button variant="contained" color="primary">
                  Register
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
