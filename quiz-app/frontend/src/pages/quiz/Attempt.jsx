import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setAnswer,
  nextQuestion,
  prevQuestion,
  setCurrentIndex,
  submitQuiz,
} from '../../store/slices/quizSlice';
import ProgressBar from '../../components/quiz/ProgressBar';
import QuestionCard from '../../components/quiz/QuestionCard';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Box,
  Button,
  Paper,
  Container,
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  CheckCircleOutline as SubmitIcon,
} from '@mui/icons-material';

export default function Attempt() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questions, answers, currentIndex, status } = useSelector(
    (state) => state.quiz
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect back to lobby if no questions are loaded (e.g. page refresh)
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/quiz');
    }
  }, [questions, navigate]);

  // Redirect to result screen if already submitted
  useEffect(() => {
    if (status === 'submitted') {
      navigate('/quiz/result');
    }
  }, [status, navigate]);

  if (!questions || questions.length === 0) {
    return <LoadingSpinner message="Checking quiz session..." />;
  }

  const currentQuestion = questions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerChange = (selectedOptions) => {
    dispatch(
      setAnswer({
        questionId: currentQuestion._id,
        selectedOptions,
      })
    );
  };

  const handlePrev = () => {
    dispatch(prevQuestion());
  };

  const handleNext = () => {
    dispatch(nextQuestion());
  };

  const handleSubmitOpen = () => {
    setConfirmOpen(true);
  };

  const handleSubmitClose = () => {
    setConfirmOpen(false);
  };

  const handleSubmitConfirm = async () => {
    setConfirmOpen(false);
    setIsSubmitting(true);
    try {
      await dispatch(submitQuiz()).unwrap();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const isAnswered = (qId) => {
    return answers[qId] && answers[qId].length > 0;
  };

  if (isSubmitting) {
    return <LoadingSpinner message="Submitting quiz & calculating grade..." />;
  }

  return (
    <Container maxWidth="md" className="py-4">
      {/* Top Progress bar */}
      <ProgressBar current={currentIndex} total={questions.length} />

      {/* Main Active Question */}
      <Box className="mb-6">
        <QuestionCard
          question={currentQuestion}
          serialNumber={currentIndex + 1}
          selectedAnswers={answers[currentQuestion._id] || []}
          onAnswerChange={handleAnswerChange}
          disabled={isSubmitting}
        />
      </Box>

      {/* Bottom Nav + Dots Panel */}
      <Paper elevation={1} className="p-4 md:p-6 flex flex-col gap-6 items-center">
        {/* Navigation Buttons */}
        <Box className="w-full flex justify-between items-center gap-4">
          <Button
            variant="outlined"
            onClick={handlePrev}
            disabled={isFirstQuestion || isSubmitting}
            startIcon={<PrevIcon />}
            sx={{ px: { xs: 2, sm: 3 } }}
          >
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmitOpen}
              disabled={isSubmitting}
              endIcon={<SubmitIcon />}
              sx={{ px: { xs: 2, sm: 3 }, fontWeight: 700 }}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={isSubmitting}
              endIcon={<NextIcon />}
              sx={{ px: { xs: 2, sm: 3 } }}
            >
              Next
            </Button>
          )}
        </Box>

        {/* Quick jump pagination dots */}
        <Box className="flex flex-wrap justify-center gap-2">
          {questions.map((q, idx) => {
            const isActive = idx === currentIndex;
            const answered = isAnswered(q._id);
            
            return (
              <Button
                key={q._id}
                onClick={() => dispatch(setCurrentIndex(idx))}
                disabled={isSubmitting}
                sx={{
                  minWidth: 36,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  p: 0,
                  fontSize: 12,
                  fontWeight: 700,
                  border: '2px solid',
                  borderColor: isActive
                    ? 'primary.main'
                    : answered
                    ? 'primary.light'
                    : 'divider',
                  bgcolor: isActive
                    ? 'primary.main'
                    : answered
                    ? 'primary.lighter'
                    : 'transparent',
                  color: isActive
                    ? 'primary.contrastText'
                    : answered
                    ? 'primary.dark'
                    : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.main' : 'action.hover',
                  },
                }}
              >
                {idx + 1}
              </Button>
            );
          })}
        </Box>
      </Paper>

      {/* Confirm Submission Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Submit Answers?"
        message="Are you sure you want to submit your answers? You will not be able to change them afterwards."
        confirmText="Submit Quiz"
        cancelText="Cancel"
        confirmColor="secondary"
        onConfirm={handleSubmitConfirm}
        onCancel={handleSubmitClose}
      />
    </Container>
  );
}
