'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormHelperText,
  IconButton,
  Card,
  CardContent,
  Stack,
  Badge,
  Tooltip,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Zod schema
const optionSchema = z.object({
  optionNumber: z.number(),
  text: z.string().trim().min(1, 'Option text cannot be empty'),
});

const questionFormSchema = z
  .object({
    title: z.string().trim().min(10, 'Title must be at least 10 characters long'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    category: z.string().trim().min(1, 'Category is required'),
    questionType: z.enum(['single', 'multiple']),
    options: z
      .array(optionSchema)
      .min(2, 'At least 2 options are required')
      .max(5, 'Maximum of 5 options are allowed'),
    correctAnswers: z.array(z.number()).min(1, 'Select at least one correct answer'),
  })
  .refine(
    (data) => {
      if (data.questionType === 'single') {
        return data.correctAnswers.length === 1;
      }
      return true;
    },
    {
      message: 'For single choice, exactly one correct answer must be selected',
      path: ['correctAnswers'],
    }
  );

export default function QuestionForm({ initialData, onSubmit, isSubmitting = false }) {
  const isEdit = !!initialData;

  const defaultValues = initialData
    ? {
        title: initialData.title,
        difficulty: initialData.difficulty,
        category: initialData.category,
        questionType: initialData.questionType,
        options: initialData.options,
        correctAnswers: initialData.correctAnswers,
      }
    : {
        title: '',
        difficulty: 'easy',
        category: '',
        questionType: 'single',
        options: [
          { optionNumber: 1, text: '' },
          { optionNumber: 2, text: '' },
        ],
        correctAnswers: [],
      };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watchQuestionType = watch('questionType');
  const watchCorrectAnswers = watch('correctAnswers') || [];
  const watchOptions = watch('options') || [];

  // Reset correct answers when type changes
  useEffect(() => {
    if (!isEdit) {
      setValue('correctAnswers', []);
    }
  }, [watchQuestionType, setValue, isEdit]);

  const handleAddOption = () => {
    if (fields.length < 5) {
      append({ optionNumber: fields.length + 1, text: '' });
    }
  };

  const handleRemoveOption = (index) => {
    if (fields.length > 2) {
      const removedOptNumber = fields[index].optionNumber;
      remove(index);

      // Readjust option numbers for remaining fields
      const updatedCorrectAnswers = watchCorrectAnswers
        .filter((num) => num !== removedOptNumber)
        .map((num) => (num > removedOptNumber ? num - 1 : num));

      setValue('correctAnswers', updatedCorrectAnswers);

      // Re-assign optionNumbers sequentially
      setTimeout(() => {
        const currentOptions = watch('options') || [];
        const mapped = currentOptions.map((opt, i) => ({
          optionNumber: i + 1,
          text: opt.text,
        }));
        setValue('options', mapped);
      }, 0);
    }
  };

  const handleCorrectAnswerToggle = (optNumber) => {
    if (watchQuestionType === 'single') {
      setValue('correctAnswers', [optNumber], { shouldValidate: true });
    } else {
      const isSelected = watchCorrectAnswers.includes(optNumber);
      let newAnswers;
      if (isSelected) {
        newAnswers = watchCorrectAnswers.filter((id) => id !== optNumber);
      } else {
        newAnswers = [...watchCorrectAnswers, optNumber];
      }
      setValue('correctAnswers', newAnswers, { shouldValidate: true });
    }
  };

  return (
    <Card elevation={2}>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            {/* Title */}
            <TextField
              label="Question Title"
              placeholder="e.g. What is the output of console.log(typeof null) in JavaScript?"
              multiline
              rows={3}
              fullWidth
              required
              disabled={isSubmitting}
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            {/* Row: Difficulty, Category, Type */}
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="difficulty-label" label="Difficulty" {...field} disabled={isSubmitting}>
                      <MenuItem value="easy">Easy</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="hard">Hard</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.difficulty?.message}</FormHelperText>
              </FormControl>

              <TextField
                label="Category"
                placeholder="e.g. JavaScript, CSS, General"
                fullWidth
                required
                disabled={isSubmitting}
                {...register('category')}
                error={!!errors.category}
                helperText={errors.category?.message}
              />

              <FormControl component="fieldset" error={!!errors.questionType}>
                <FormLabel component="legend">Question Type</FormLabel>
                <Controller
                  name="questionType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field} disabled={isSubmitting}>
                      <FormControlLabel value="single" control={<Radio size="small" />} label="Single Choice" />
                      <FormControlLabel value="multiple" control={<Radio size="small" />} label="Multiple Choice" />
                    </RadioGroup>
                  )}
                />
                <FormHelperText>{errors.questionType?.message}</FormHelperText>
              </FormControl>
            </Box>

            {/* Options Panel */}
            <Box>
              <Box className="flex justify-between items-center mb-3">
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Question Options &amp; Correct Answers
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddOption}
                  disabled={fields.length >= 5 || isSubmitting}
                >
                  Add Option ({fields.length}/5)
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" className="block mb-4">
                Enter your options below. Check/select the badge to the left of the input to mark that option as correct.
              </Typography>

              <Stack spacing={2}>
                {fields.map((field, index) => {
                  const optNumber = index + 1;
                  const isCorrect = watchCorrectAnswers.includes(optNumber);

                  return (
                    <Box key={field.id} className="flex items-center gap-3">
                      {/* Checkbox or Radio selection representing optionNumber */}
                      <Tooltip title={`Mark Option ${optNumber} as correct`}>
                        <IconButton
                          color={isCorrect ? 'success' : 'default'}
                          onClick={() => handleCorrectAnswerToggle(optNumber)}
                          disabled={isSubmitting}
                          sx={{
                            border: '1px solid',
                            borderColor: isCorrect ? 'success.main' : 'divider',
                            bgcolor: isCorrect ? 'success.lighter' : 'transparent',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {watchQuestionType === 'single' ? (
                            <Radio checked={isCorrect} size="small" color="success" />
                          ) : (
                            <Checkbox checked={isCorrect} size="small" color="success" />
                          )}
                        </IconButton>
                      </Tooltip>

                      <TextField
                        label={`Option ${optNumber}`}
                        fullWidth
                        required
                        disabled={isSubmitting}
                        {...register(`options.${index}.text`)}
                        error={!!errors.options?.[index]?.text}
                        helperText={errors.options?.[index]?.text?.message}
                        InputProps={{
                          startAdornment: (
                            <Badge
                              badgeContent={optNumber}
                              color={isCorrect ? 'success' : 'default'}
                              className="mr-3"
                              sx={{ '& .MuiBadge-badge': { fontWeight: 600 } }}
                            />
                          ),
                        }}
                      />

                      {fields.length > 2 && (
                        <Tooltip title="Remove Option">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveOption(index)}
                            disabled={isSubmitting}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  );
                })}
              </Stack>

              {errors.correctAnswers && (
                <Alert severity="error" className="mt-4">
                  {errors.correctAnswers.message}
                </Alert>
              )}
            </Box>

            <Divider />

            {/* Form Actions */}
            <Box className="flex justify-end gap-3">
              <Link to="/admin/questions" className="no-underline">
                <Button variant="outlined" color="inherit" startIcon={<BackIcon />} disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Question'}
              </Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
