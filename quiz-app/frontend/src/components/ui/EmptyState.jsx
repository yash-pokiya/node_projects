import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined as EmptyIcon } from '@mui/icons-material';

export default function EmptyState({
  title = 'No records found',
  description = 'There is no data to display here at the moment.',
  actionText,
  onActionClick,
  icon,
}) {
  return (
    <Box
      className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl my-4 min-h-[30vh]"
    >
      <Box className="text-gray-400 dark:text-gray-600 mb-3">
        {icon || <EmptyIcon sx={{ fontSize: 60 }} />}
      </Box>
      <Typography variant="h6" className="font-semibold mb-1">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="max-w-md mb-4">
        {description}
      </Typography>
      {actionText && onActionClick && (
        <Button variant="contained" color="primary" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}
