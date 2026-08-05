import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Chip } from '@mui/material';

export default function ResultCard({
  correctAnswers = 0,
  totalQuestions = 10,
  percentage = '0%',
  grade = 'F',
}) {
  const numericPercent = parseInt(percentage, 10) || 0;

  const getGradeDetails = (g) => {
    switch (g) {
      case 'A':
        return { label: 'Excellent (A)', color: '#10B981', bg: '#D1FAE5' };
      case 'B':
        return { label: 'Good Job (B)', color: '#3B82F6', bg: '#DBEAFE' };
      case 'C':
        return { label: 'Passed (C)', color: '#F59E0B', bg: '#FEF3C7' };
      case 'D':
        return { label: 'Needs Practice (D)', color: '#EF4444', bg: '#FEE2E2' };
      case 'F':
      default:
        return { label: 'Failed (F)', color: '#991B1B', bg: '#FEE2E2' };
    }
  };

  const gradeInfo = getGradeDetails(grade);

  return (
    <Card elevation={3} sx={{ borderRadius: '16px', overflow: 'visible' }}>
      <CardContent className="p-8 flex flex-col items-center">
        {/* Grade Badge */}
        <Chip
          label={gradeInfo.label}
          sx={{
            bgcolor: gradeInfo.bg,
            color: gradeInfo.color,
            fontWeight: 700,
            fontSize: 14,
            px: 1,
            py: 2,
            mb: 4,
            borderRadius: '8px',
          }}
        />

        {/* Circular Wheel Progress */}
        <Box className="relative flex items-center justify-center mb-6">
          <CircularProgress
            variant="determinate"
            value={100}
            size={160}
            thickness={6}
            sx={{ color: 'action.hover' }}
          />
          <CircularProgress
            variant="determinate"
            value={numericPercent}
            size={160}
            thickness={6}
            sx={{
              color: gradeInfo.color,
              position: 'absolute',
              strokeLinecap: 'round',
            }}
          />
          
          <Box className="absolute flex flex-col items-center justify-center">
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {percentage}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }} color="text.secondary">
              SCORE
            </Typography>
          </Box>
        </Box>

        {/* Score text breakdown */}
        <Typography variant="h6" className="font-extrabold" color="text.primary">
          {correctAnswers} out of {totalQuestions}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-1 font-medium">
          Correct Answers Count
        </Typography>
      </CardContent>
    </Card>
  );
}
