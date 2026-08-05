import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatsCard({ title, value, icon, color = 'primary.main' }) {
  return (
    <Card className="h-full border-l-4 border-solid" sx={{ borderLeftColor: color }}>
      <CardContent>
        <Box className="flex items-center justify-between">
          <Box className="flex flex-col gap-1">
            <Typography variant="caption" color="text.secondary" className="font-bold uppercase tracking-wider">
              {title}
            </Typography>
            <Typography variant="h4" className="font-extrabold">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`, // Translucent color background
              color: color,
              p: 1.5,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
