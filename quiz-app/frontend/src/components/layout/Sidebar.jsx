import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  HelpOutline as QuestionsIcon,
  AddCircleOutline as CreateIcon,
  PlayCircleOutline as AttemptIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

export default function Sidebar({ open, onClose, isMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  if (!user) return null;

  const pathname = location.pathname;
  const role = user.role;

  const adminLinks = [
    { text: 'Dashboard', icon: <DashboardIcon />, href: '/admin' },
    { text: 'Question Bank', icon: <QuestionsIcon />, href: '/admin/questions' },
    { text: 'Add Question', icon: <CreateIcon />, href: '/admin/questions/create' },
  ];

  const userLinks = [
    { text: 'Quiz Lobby', icon: <AttemptIcon />, href: '/quiz' },
  ];

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const renderList = (links, title) => (
    <Box className="mb-4">
      {title && (
        <Typography variant="caption" className="px-4 py-2 font-bold uppercase tracking-wider block" color="text.secondary">
          {title}
        </Typography>
      )}
      <List>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <ListItem key={link.text} disablePadding>
              <Link href={link.href} className="w-full no-underline text-inherit" onClick={handleLinkClick}>
                <ListItemButton
                  sx={{
                    mx: 1.5,
                    borderRadius: '8px',
                    mb: 0.5,
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.light' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.contrastText' : 'text.secondary', minWidth: 40 }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.text} primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  const drawerContent = (
    <Box className="h-full flex flex-col justify-between pt-4 pb-4">
      <Box>
        {/* Render role-appropriate list */}
        {role === 'admin' && renderList(adminLinks, 'Admin Panel')}
        {renderList(userLinks, 'Practice Area')}
      </Box>

      <Box>
        <Divider className="my-2 mx-4" />
        {/* User Card */}
        <Box className="px-4 py-3 mx-4 my-2 flex flex-col gap-1 rounded-xl bg-gray-50 dark:bg-slate-800">
          <Typography variant="body2" sx={{ fontWeight: 600 }} className="truncate">
            {user.name}
          </Typography>
          <Box className="flex items-center justify-between mt-1">
            <Chip
              label={role === 'admin' ? 'Admin' : 'User'}
              size="small"
              color={role === 'admin' ? 'secondary' : 'primary'}
              sx={{ height: 20, fontSize: 11, fontWeight: 600 }}
            />
          </Box>
        </Box>
        
        {/* Logout button */}
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mx: 1.5,
                borderRadius: '8px',
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.lighter',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
      {/* Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
      
      {/* Drawer for Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
        }}
        open
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
    </Box>
  );
}
