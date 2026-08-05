import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      className="py-4 px-6 mt-auto text-center border-t border-solid border-gray-200 dark:border-gray-800"
      sx={{ bgcolor: 'background.paper', color: 'text.secondary' }}
    >
      <Typography variant="body2" sx={{ fontSize: '13px' }}>
        &copy; {new Date().getFullYear()} QuizMaster. All rights reserved. Built with Next.js, Redux, MUI, and Tailwind.
      </Typography>
    </Box>
  );
}
