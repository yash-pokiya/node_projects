import React from 'react';
import OptionItem from './OptionItem';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

export default function QuestionCard({
  question,
  serialNumber,
  selectedAnswers = [],
  onAnswerChange,
  disabled = false,
}) {
  if (!question) return null;

  const { title, options, questionType, category, difficulty } = question;

  const handleOptionClick = (optionNumber) => {
    if (disabled) return;

    if (questionType === 'single') {
      // For single selection: replace selected answers with this one
      onAnswerChange([optionNumber]);
    } else {
      // For multiple selection: toggle this item in the array
      const isSelected = selectedAnswers.includes(optionNumber);
      let newSelection;
      if (isSelected) {
        newSelection = selectedAnswers.filter((num) => num !== optionNumber);
      } else {
        newSelection = [...selectedAnswers, optionNumber];
      }
      onAnswerChange(newSelection);
    }
  };

  return (
    <Card elevation={2} sx={{ borderRadius: '16px' }}>
      <CardContent className="p-6 md:p-8">
        {/* Header Metadata */}
        <Box className="flex justify-between items-center gap-2 mb-4">
          <Box className="flex items-center gap-1.5">
            <Chip
              label={`Q. ${serialNumber}`}
              color="primary"
              sx={{ fontWeight: 700, borderRadius: '8px' }}
            />
            <Chip
              label={questionType === 'single' ? 'Single Choice' : 'Multiple Choice'}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Box className="flex gap-1.5">
            <Chip
              label={difficulty}
              variant="outlined"
              size="small"
              className="capitalize"
              sx={{ fontWeight: 500 }}
            />
            <Chip
              label={category}
              size="small"
              className="capitalize text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
            />
          </Box>
        </Box>

        {/* Question Title */}
        <Box className="flex gap-3 items-start mb-6">
          <HelpIcon color="primary" sx={{ fontSize: 28, mt: 0.5 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
            {title}
          </Typography>
        </Box>

        {/* Option Items Stack */}
        <Stack spacing={2}>
          {options.map((opt) => {
            const isSelected = selectedAnswers.includes(opt.optionNumber);
            return (
              <OptionItem
                key={opt.optionNumber}
                optionNumber={opt.optionNumber}
                text={opt.text}
                isSelected={isSelected}
                onClick={() => handleOptionClick(opt.optionNumber)}
                type={questionType}
                disabled={disabled}
              />
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
