import React from 'react';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';

export default function ProgressBar({ current = 0, total = 10 }) {
  const theme = useTheme();
  const progressPercent = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <Box className="w-full flex flex-col gap-2 mb-6">
      <Box className="flex justify-between items-center px-1">
        <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.secondary">
          Question {current + 1} of {total}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }} color="primary">
          {Math.round(progressPercent)}% Complete
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercent}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#334155',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
          },
        }}
      />
    </Box>
  );
}
