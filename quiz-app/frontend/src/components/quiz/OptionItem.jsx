import React from 'react';
import { Card, CardActionArea, Box, Typography, Radio, Checkbox, useTheme } from '@mui/material';

export default function OptionItem({
  optionNumber,
  text,
  isSelected = false,
  onClick,
  type = 'single', // 'single' | 'multiple'
  disabled = false,
}) {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderWidth: isSelected ? 2 : 1,
        bgcolor: isSelected ? 'primary.lighter' : 'background.paper',
        borderRadius: '12px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: isSelected ? 'primary.main' : 'primary.light',
          boxShadow: isSelected
            ? '0 4px 12px -2px rgba(99, 102, 241, 0.15)'
            : '0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <CardActionArea onClick={onClick} disabled={disabled} sx={{ p: 2 }}>
        <Box className="flex items-center gap-3">
          {/* Radio / Checkbox indicator */}
          <Box className="flex items-center">
            {type === 'single' ? (
              <Radio
                checked={isSelected}
                disabled={disabled}
                color="primary"
                size="medium"
                sx={{ p: 0.5 }}
              />
            ) : (
              <Checkbox
                checked={isSelected}
                disabled={disabled}
                color="primary"
                size="medium"
                sx={{ p: 0.5 }}
              />
            )}
          </Box>

          {/* Option Badge Number */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: isSelected ? 'primary.main' : 'action.disabledBackground',
              color: isSelected ? 'primary.contrastText' : 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            {optionNumber}
          </Box>

          {/* Option Text */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: isSelected ? 600 : 500,
              color: isSelected ? 'primary.dark' : 'text.primary',
            }}
          >
            {text}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
