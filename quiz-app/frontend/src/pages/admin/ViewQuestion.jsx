import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchQuestionById, clearCurrentQuestion } from '../../store/slices/questionSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Box,
  Typography,
  Divider,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as BackIcon,
  CheckCircle as CorrectIcon,
  RadioButtonUnchecked as EmptyIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function ViewQuestion() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentQuestion, loading, error } = useSelector((state) => state.questions);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionById(id));
    }
    return () => {
      dispatch(clearCurrentQuestion());
    };
  }, [dispatch, id]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && !currentQuestion) {
    return <LoadingSpinner message="Loading question details..." />;
  }

  if (error && !currentQuestion) {
    return (
      <Box className="p-6 text-center">
        <Typography color="error" variant="h6" className="mb-4">
          Error: {error}
        </Typography>
        <Link to="/admin/questions" className="text-indigo-600 font-medium">
          Go back to Question Bank
        </Link>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-6">
      {/* Navigation Breadcrumbs */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Box>
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/admin" className="text-gray-500 hover:text-indigo-600 no-underline text-sm font-medium">
              Admin
            </Link>
            <Link to="/admin/questions" className="text-gray-500 hover:text-indigo-600 no-underline text-sm font-medium">
              Questions
            </Link>
            <Typography color="text.primary" className="text-sm font-semibold">
              View
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" className="font-extrabold mt-2" sx={{ color: 'text.primary' }}>
            Question Details
          </Typography>
        </Box>
        
        <Box className="flex gap-2">
          <Link to="/admin/questions" className="no-underline">
            <Button variant="outlined" color="inherit" startIcon={<BackIcon />}>
              Back to List
            </Button>
          </Link>
          {currentQuestion && (
            <Link to={`/admin/questions/${currentQuestion._id}/edit`} className="no-underline">
              <Button variant="contained" color="secondary" startIcon={<EditIcon />}>
                Edit Question
              </Button>
            </Link>
          )}
        </Box>
      </Box>

      <Divider />

      {currentQuestion && (
        <Card elevation={2}>
          <CardContent className="p-6 md:p-8">
            <Stack spacing={4}>
              {/* Header Badges */}
              <Box className="flex flex-wrap gap-2">
                <Chip
                  label={`Difficulty: ${currentQuestion.difficulty}`}
                  color={getDifficultyColor(currentQuestion.difficulty)}
                  sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                />
                <Chip
                  label={`Category: ${currentQuestion.category}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                />
                <Chip
                  label={currentQuestion.questionType === 'single' ? 'Single Choice' : 'Multiple Choice'}
                  color="secondary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              {/* Title Section */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="font-bold uppercase tracking-wider mb-1">
                  Question Text
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.5 }}>
                  {currentQuestion.title}
                </Typography>
              </Box>

              <Divider />

              {/* Options Section */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="font-bold uppercase tracking-wider mb-3">
                  Options &amp; Correct Answer Highlights
                </Typography>

                <Stack spacing={2}>
                  {currentQuestion.options.map((opt) => {
                    const isCorrect = currentQuestion.correctAnswers.includes(opt.optionNumber);

                    return (
                      <Paper
                        key={opt._id || opt.optionNumber}
                        variant="outlined"
                        className="p-4 flex items-center justify-between transition-colors"
                        sx={{
                          borderColor: isCorrect ? 'success.main' : 'divider',
                          bgcolor: isCorrect ? 'success.lighter' : 'background.paper',
                          borderWidth: isCorrect ? 2 : 1,
                        }}
                      >
                        <Box className="flex items-center gap-3">
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: isCorrect ? 'success.main' : 'action.disabledBackground',
                              color: isCorrect ? 'success.contrastText' : 'text.secondary',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {opt.optionNumber}
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: isCorrect ? 600 : 500,
                              color: isCorrect ? 'success.dark' : 'text.primary',
                            }}
                          >
                            {opt.text}
                          </Typography>
                        </Box>

                        {isCorrect ? (
                          <Chip
                            icon={<CorrectIcon />}
                            label="Correct Answer"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <Box className="text-gray-300 dark:text-gray-700 pr-2">
                            <EmptyIcon />
                          </Box>
                        )}
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
