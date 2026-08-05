import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetQuiz, startQuiz } from '../../store/slices/quizSlice';
import ResultCard from '../../components/quiz/ResultCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Container,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Refresh as TryAgainIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

export default function Result() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { result, questions, loading } = useSelector((state) => state.quiz);
  const [localLoading, setLocalLoading] = useState(false);

  // Redirect to lobby if results are missing (e.g. page refresh)
  useEffect(() => {
    if (!result) {
      navigate('/quiz');
    }
  }, [result, navigate]);

  if (!result) {
    return <LoadingSpinner message="Checking quiz results..." />;
  }

  const { correctAnswers, totalQuestions, percentage, grade, details } = result;

  const handleTryAgain = async () => {
    setLocalLoading(true);
    dispatch(resetQuiz());
    try {
      await dispatch(startQuiz()).unwrap();
      navigate('/quiz/attempt');
    } catch (err) {
      setLocalLoading(false);
    }
  };

  const handleGoHome = () => {
    dispatch(resetQuiz());
    navigate('/quiz');
  };

  if (localLoading || loading) {
    return <LoadingSpinner message="Starting a new quiz session..." />;
  }

  return (
    <Container maxWidth="md" className="py-4 flex flex-col gap-6">
      {/* Title Header */}
      <Box className="text-center">
        <Typography variant="h4" className="font-extrabold" sx={{ color: 'text.primary' }}>
          Quiz Results
        </Typography>
        <Typography variant="body1" color="text.secondary" className="mt-1">
          Review your performance below and inspect incorrect answers.
        </Typography>
      </Box>

      <Divider />

      <Grid container spacing={4} className="items-start">
        {/* Score Wheel Column */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <ResultCard
              correctAnswers={correctAnswers}
              totalQuestions={totalQuestions}
              percentage={percentage}
              grade={grade}
            />

            {/* Action Buttons */}
            <Box className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="contained"
                color="primary"
                onClick={handleTryAgain}
                startIcon={<TryAgainIcon />}
                fullWidth
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleGoHome}
                startIcon={<HomeIcon />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Go Home
              </Button>
            </Box>
          </Stack>
        </Grid>

        {/* Detailed Question Review Accordions Column */}
        <Grid item xs={12} md={7}>
          <Paper elevation={1} className="p-6">
            <Typography variant="h6" className="font-extrabold mb-4" color="text.primary">
              Question Review
            </Typography>

            <Stack spacing={2}>
              {details.map((detail, idx) => {
                // Find original question to access options text
                const originalQ = questions.find((q) => q._id === detail.questionId);
                const isCorrect = detail.isCorrect;

                return (
                  <Accordion
                    key={detail.questionId}
                    variant="outlined"
                    sx={{
                      borderRadius: '12px !important',
                      borderColor: isCorrect ? 'success.main' : 'error.main',
                      overflow: 'hidden',
                      '&::before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandIcon />}
                      sx={{
                        bgcolor: isCorrect ? 'success.lighter' : 'error.lighter',
                        px: 2,
                      }}
                    >
                      <Box className="flex items-start gap-2.5 w-full pr-4">
                        <Box sx={{ mt: 0.2 }}>
                          {isCorrect ? (
                            <CorrectIcon color="success" fontSize="small" />
                          ) : (
                            <WrongIcon color="error" fontSize="small" />
                          )}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, display: 'inline', mr: 1 }} color={isCorrect ? 'success.dark' : 'error.dark'}>
                            Q{idx + 1}.
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, display: 'inline' }} color="text.primary">
                            {detail.title}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    
                    <AccordionDetails className="p-4 bg-white dark:bg-slate-900">
                      {originalQ ? (
                        <Stack spacing={1.5}>
                          {originalQ.options.map((opt) => {
                            const isUserSelected = detail.yourAnswer.includes(opt.optionNumber);
                            const isAnswerCorrect = detail.correctAnswer.includes(opt.optionNumber);
                            
                            // Style calculation
                            let borderColor = 'divider';
                            let bgColor = 'transparent';
                            let chipText = null;
                            let chipColor = 'default';

                            if (isAnswerCorrect) {
                              borderColor = 'success.main';
                              bgColor = 'success.lighter';
                              chipText = 'Correct Answer';
                              chipColor = 'success';
                            } else if (isUserSelected && !isAnswerCorrect) {
                              borderColor = 'error.main';
                              bgColor = 'error.lighter';
                              chipText = 'Your Answer (Wrong)';
                              chipColor = 'error';
                            }

                            if (isUserSelected && isAnswerCorrect) {
                              chipText = 'Your Correct Answer';
                            }

                            return (
                              <Paper
                                key={opt.optionNumber}
                                variant="outlined"
                                className="p-3 flex items-center justify-between"
                                sx={{ borderColor, bgcolor: bgColor }}
                              >
                                <Box className="flex items-center gap-2">
                                  <Box
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: '50%',
                                      bgcolor: isAnswerCorrect ? 'success.main' : isUserSelected ? 'error.main' : 'action.disabledBackground',
                                      color: isAnswerCorrect || isUserSelected ? 'white' : 'text.secondary',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 700,
                                      fontSize: 11,
                                    }}
                                  >
                                    {opt.optionNumber}
                                  </Box>
                                  <Typography variant="body2" sx={{ fontWeight: isUserSelected || isAnswerCorrect ? 600 : 500 }}>
                                    {opt.text}
                                  </Typography>
                                </Box>

                                {chipText && (
                                  <Chip
                                    label={chipText}
                                    color={chipColor}
                                    size="small"
                                    sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                                  />
                                )}
                              </Paper>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Could not retrieve option details.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
