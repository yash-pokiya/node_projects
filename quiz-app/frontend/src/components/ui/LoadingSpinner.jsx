import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ message = 'Loading details...' }) {
  return (
    <Box
      className="flex flex-col items-center justify-center min-h-[50vh] w-full p-6"
    >
      <CircularProgress color="primary" size={48} thickness={4} />
      {message && (
        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-4 font-medium animate-pulse"
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
